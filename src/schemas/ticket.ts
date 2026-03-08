import { z } from "zod";

export const normalizedTicketSchema = z.object({
  source: z.enum(["jira", "azure", "github", "unknown"]),
  title: z.string().default(""),
  ticketId: z.string().optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  acceptanceCriteria: z.array(z.string()).default([]),
  comments: z.array(z.string()).default([]),
  labels: z.array(z.string()).default([]),
  priority: z.string().optional(),
  storyPoints: z.number().optional(),
  assignee: z.string().optional(),
  rawExtractedText: z.string().optional(),
});

export type NormalizedTicketSchema = z.infer<typeof normalizedTicketSchema>;