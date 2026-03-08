import { NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "@/lib/openai";
import { buildSourceSpecificGuidance, ticketJsonSchema } from "@/lib/ticketExtraction";
import { normalizedTicketSchema } from "@/schemas/ticket";

const requestSchema = z.object({
  source: z.enum(["jira", "azure", "github", "unknown"]),
  images: z.array(z.string()).min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = requestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsedBody.error.flatten() },
        { status: 400 }
      );
    }

    const { source, images } = parsedBody.data;

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      response_format: {
        type: "json_schema",
        json_schema: ticketJsonSchema,
      },
      messages: [
        {
          role: "system",
          content: `
You are a ticket analyzer.

Your job:
- Read one or more screenshots of a software development ticket
- Extract visible information only
- Return a normalized ticket object
- If something is not visible, omit it or leave it empty
- Never invent requirements
- Keep extracted text faithful to the screenshot
- acceptanceCriteria, comments, and labels must always be arrays

${buildSourceSpecificGuidance(source)}
          `.trim(),
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Analyze these ticket screenshots and extract the ticket data.

Rules:
- source must be "${source}"
- title is required; if not visible, use an empty string
- Combine information from all screenshots
- Put longer visible text in rawExtractedText
- Return only the JSON object matching the schema
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
      return NextResponse.json(
        { error: "Model returned no content" },
        { status: 500 }
      );
    }

    const parsedTicket = normalizedTicketSchema.safeParse(JSON.parse(raw));

    if (!parsedTicket.success) {
      return NextResponse.json(
        {
          error: "Model returned invalid ticket structure",
          details: parsedTicket.error.flatten(),
          raw,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ticket: parsedTicket.data,
    });
  } catch (error) {
    console.error("analyze-ticket error", error);

    return NextResponse.json(
      { error: "Failed to analyze ticket" },
      { status: 500 }
    );
  }
}