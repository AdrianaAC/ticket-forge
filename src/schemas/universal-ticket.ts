import { z } from "zod";

export const ticketSourceSchema = z.enum([
  "jira",
  "azure",
  "github",
  "unknown",
]);

export const ticketKindSchema = z.enum([
  "epic",
  "feature",
  "story",
  "task",
  "bug",
  "subtask",
  "issue",
  "spike",
  "improvement",
  "pbi",
  "unknown",
]);

export const ticketPrioritySchema = z.enum([
  "lowest",
  "low",
  "medium",
  "high",
  "highest",
  "critical",
  "unknown",
]);

export const ticketStatusCategorySchema = z.enum([
  "backlog",
  "todo",
  "in_progress",
  "review",
  "testing",
  "blocked",
  "done",
  "cancelled",
  "unknown",
]);

export const universalTicketSchema = z.object({
  source: ticketSourceSchema,

  id: z.string().nullable().optional(),
  key: z.string().nullable().optional(),
  project: z.string().nullable().optional(),
  url: z.string().nullable().optional(),

  kind: ticketKindSchema.default("unknown"),
  title: z.string().default(""),
  description: z.string().nullable().optional(),

  statusRaw: z.string().nullable().optional(),
  statusCategory: ticketStatusCategorySchema.default("unknown"),

  priorityRaw: z.string().nullable().optional(),
  priorityNormalized: ticketPrioritySchema.nullable().optional(),

  assignee: z.string().nullable().optional(),
  reporter: z.string().nullable().optional(),
  createdBy: z.string().nullable().optional(),

  sprint: z.string().nullable().optional(),
  milestone: z.string().nullable().optional(),

  storyPoints: z.number().nullable().optional(),
  originalEstimateHours: z.number().nullable().optional(),
  remainingWorkHours: z.number().nullable().optional(),
  completedWorkHours: z.number().nullable().optional(),

  dueDate: z.string().nullable().optional(),

  parentKey: z.string().nullable().optional(),
  parentTitle: z.string().nullable().optional(),
  epicKey: z.string().nullable().optional(),
  epicTitle: z.string().nullable().optional(),

  children: z
    .array(
      z.object({
        key: z.string().nullable().optional(),
        title: z.string(),
        kind: ticketKindSchema.nullable().optional(),
      }),
    )
    .default([]),

  labels: z.array(z.string()).default([]),
  components: z.array(z.string()).default([]),

  areaPath: z.string().nullable().optional(),
  iterationPath: z.string().nullable().optional(),

  fixVersions: z.array(z.string()).default([]),

  acceptanceCriteria: z.array(z.string()).default([]),
  reproductionSteps: z.array(z.string()).default([]),

  expectedBehavior: z.string().nullable().optional(),
  actualBehavior: z.string().nullable().optional(),
  environment: z.string().nullable().optional(),

  comments: z.array(z.string()).default([]),

  attachments: z
    .array(
      z.object({
        name: z.string().nullable().optional(),
        type: z.string().nullable().optional(),
      }),
    )
    .default([]),

  extractedFromScreenshots: z.boolean().default(true),

  sourceScreenshotsCount: z.number().nullable().optional(),

  rawExtractedText: z.string().nullable().optional(),

  fieldConfidence: z.record(z.string(), z.number()).optional(),

  missingCriticalFields: z.array(z.string()).default([]),

  customFields: z
    .record(
      z.string(),
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.string()),
        z.null(),
      ]),
    )
    .default({}),
});

export const ticketAnalysisResultSchema = z.object({
  ticket: universalTicketSchema,
  missingCriticalFields: z.array(z.string()).default([]),
  lowConfidenceFields: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
  extractionWarnings: z.array(z.string()).default([]),
});

export type UniversalTicketSchema = z.infer<typeof universalTicketSchema>;
export type TicketAnalysisResultSchema = z.infer<
  typeof ticketAnalysisResultSchema
>;
