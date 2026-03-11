import { NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "@/lib/openai";
import { ticketAnalysisJsonSchema } from "@/lib/openai-ticket-schema";
import { ticketAnalysisResultSchema } from "@/schemas/universal-ticket";
import {
  getMissingCriticalFields,
  normalizeKind,
  normalizePriority,
  normalizeStatusCategory,
} from "@/lib/ticket-normalizers";
import { ticketDomainContext } from "@/lib/agent-context/ticket-domain-context";
import { buildFallbackNotes } from "@/lib/ticket-notes";
import { normalizeTicketNulls } from "@/lib/utils/ticket-null-normalizer";
import { validateTicketSchema } from "@/lib/utils/ticket-schema-self-test";
import type { UniversalTicket } from "@/types/universal-ticket";

const requestSchema = z.object({
  source: z.enum(["jira", "azure", "github", "unknown"]),
  images: z.array(z.string()).min(1),
});

const CREATED_FIELD_ALIASES = [
  "created_at",
  "createdAt",
  "created",
  "created_date",
  "createdDate",
];

const UPDATED_FIELD_ALIASES = [
  "updated_at",
  "updatedAt",
  "updated",
  "updated_date",
  "updatedDate",
];

const LOW_CONFIDENCE_DEFAULT = 0.6;

function promoteCustomFieldAlias(
  customFields: Record<string, string | number | boolean | string[] | null>,
  aliases: string[],
  canonicalKey: string,
) {
  if (customFields[canonicalKey] != null) return;

  for (const alias of aliases) {
    const value = customFields[alias];
    if (value != null) {
      customFields[canonicalKey] = value;
      return;
    }
  }
}

function mapLowConfidenceFieldAliases(field: string): string[] {
  const normalized = field.trim().toLowerCase().replace(/[\s-]+/g, "_");

  switch (normalized) {
    case "issue_type":
    case "type":
      return ["kind", "issue_type", "type"];
    case "status":
      return ["statusRaw", "status"];
    case "priority":
      return ["priorityRaw", "priorityNormalized", "priority"];
    case "ticket_key":
      return ["key", "id"];
    default:
      return [field, normalized];
  }
}

export async function POST(request: Request) {
  validateTicketSchema();

  try {
    const body = await request.json();
    const parsedBody = requestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { source, images } = parsedBody.data;

    const prompt = `
Analyze these screenshots as a ${source} ticket.

Your task:
- identify and extract all visible ticket fields
- preserve platform-specific meanings exactly as shown
- normalize values into the required TicketAnalysisResult schema
- never invent values that are not visible
- if a field is missing, set it to null/[] and include it in missingCriticalFields when relevant
- if a field is visible but uncertain (blurred/cropped), include it in lowConfidenceFields
- include useful extraction concerns in extractionWarnings
- include short factual notes in notes only when they help review

Extraction heuristics:
- Ticket key/id often matches PROJECT-123. If visible, extract both ticket.key and ticket.id.
- If key follows PROJECT-123 and project is visible in the key, set ticket.project to PROJECT unless a clearer project name is shown.
- For Jira issue type, check labels near the key/title and action text like "Add epic", "Add child issue", "Sub-task".
- If a "child issues" list or linked child rows are visible, extract every visible child into ticket.children with key/title/kind (kind if visible).
- If parent/epic references are visible, populate parentKey/parentTitle and epicKey/epicTitle.
- Status is often near the top-right workflow control; preserve the exact raw label in statusRaw.
- Priority often appears in a details/sidebar panel; preserve exact raw text in priorityRaw.
- Assignee, Reporter, and Creator are often in details/sidebar sections.
- If created/updated timestamps are visible, store them in ticket.customFields as created_at and updated_at.
- Preserve all visible labels/components/fix versions/comments.
- Keep exact casing and wording from the screenshot whenever possible.
- If content appears cropped or truncated, mention that in extractionWarnings.

Focus especially on:
- title, ticket key/id, issue type
- description, acceptance criteria, reproduction steps
- status, priority, assignee/reporter/creator
- labels, components, fix versions
- planning fields (sprint, story points, estimates, due date)
- hierarchy fields (parent, epic, children)

Return only valid JSON matching the schema.
`.trim();

    const response = await openai.responses.create({
      model: process.env.OPENAI_TICKET_MODEL ?? "gpt-4.1",
      instructions: ticketDomainContext,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: prompt,
            },
            ...images.map((image) => ({
              type: "input_image" as const,
              image_url: image,
              detail: "high" as const,
            })),
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: ticketAnalysisJsonSchema.name,
          strict: ticketAnalysisJsonSchema.strict,
          schema: ticketAnalysisJsonSchema.schema,
        },
      },
    });

    const raw = response.output_text?.trim();

    if (!raw) {
      return NextResponse.json({ error: "No model output" }, { status: 500 });
    }

    const json = JSON.parse(raw);
    const parsed = ticketAnalysisResultSchema.safeParse(json);

    if (!parsed.success) {
      console.error("Invalid AI response payload", {
        details: parsed.error.flatten(),
        json,
      });

      return NextResponse.json(
        { error: "Invalid AI response", details: parsed.error.flatten(), raw },
        { status: 500 },
      );
    }

    const result = parsed.data;

    const t = normalizeTicketNulls(result.ticket) as unknown as UniversalTicket;

    t.kind = normalizeKind(t.kind);

    t.priorityNormalized = normalizePriority(
      t.priorityRaw ?? t.priorityNormalized ?? undefined,
    );

    t.statusCategory = normalizeStatusCategory(
      t.statusRaw ?? t.statusCategory ?? undefined,
    );

    t.source = source;
    t.extractedFromScreenshots = true;
    t.sourceScreenshotsCount = images.length;

    if (!t.key && t.id) t.key = t.id;
    if (!t.id && t.key) t.id = t.key;

    const keyLike = (t.key ?? t.id)?.trim();
    if (!t.project && keyLike) {
      const projectMatch = keyLike.match(/^([A-Z][A-Z0-9]+)-\d+$/i);
      if (projectMatch) {
        t.project = projectMatch[1].toUpperCase();
      }
    }

    const customFields = (t.customFields ??= {});
    promoteCustomFieldAlias(customFields, CREATED_FIELD_ALIASES, "created_at");
    promoteCustomFieldAlias(customFields, UPDATED_FIELD_ALIASES, "updated_at");

    const lowConfidenceScores = t.fieldConfidence ?? {};
    for (const field of result.lowConfidenceFields) {
      for (const alias of mapLowConfidenceFieldAliases(field)) {
        const existing = lowConfidenceScores[alias];
        if (typeof existing === "number") {
          lowConfidenceScores[alias] = Math.min(existing, LOW_CONFIDENCE_DEFAULT);
        } else {
          lowConfidenceScores[alias] = LOW_CONFIDENCE_DEFAULT;
        }
      }
    }
    t.fieldConfidence =
      Object.keys(lowConfidenceScores).length > 0
        ? lowConfidenceScores
        : undefined;

    result.missingCriticalFields = getMissingCriticalFields(t);
    t.missingCriticalFields = result.missingCriticalFields;

    const fallbackNotes = buildFallbackNotes(t);
    result.notes = Array.from(new Set([...result.notes, ...fallbackNotes]));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to analyze ticket" },
      { status: 500 },
    );
  }
}
