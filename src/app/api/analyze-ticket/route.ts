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

const requestSchema = z.object({
  source: z.enum(["jira", "azure", "github", "unknown"]),
  images: z.array(z.string()).min(1),
});

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

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: {
        type: "json_schema",
        json_schema: ticketAnalysisJsonSchema,
      },
      messages: [
        {
          role: "system",
          content: ticketDomainContext,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Analyze these screenshots as a ${source} ticket.

Your task:
- identify the visible ticket fields
- preserve platform-specific meanings
- normalize them into the required TicketAnalysisResult schema
- do not invent values
- if information is missing, list it in missingCriticalFields
- if information is unclear or partially visible, list it in lowConfidenceFields
- include useful extraction concerns in extractionWarnings
- include short analyst notes in notes when they help the user review the extraction

Focus especially on:
- title
- ticket key or id
- issue/work item type
- description
- acceptance criteria
- priority
- status
- assignee
- labels
- comments
- planning fields like sprint, story points, estimates
- hierarchy fields like parent or epic
- bug-specific fields like reproduction steps, expected behavior, actual behavior

Return only valid JSON matching the schema.
`.trim(),
            },
            ...images.map((image) => ({
              type: "image_url" as const,
              image_url: { url: image },
            })),
          ],
        },
      ],
    });

    const raw = response.choices[0]?.message?.content;

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

    normalizeTicketNulls(result.ticket);

    const t = result.ticket;

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
