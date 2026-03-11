/**
 * TicketForge Structured Output Schema
 *
 * MAINTENANCE RULES
 *
 * When adding or modifying fields:
 *
 * 1. Every property inside a strict object MUST appear in `required`
 * 2. Fields that may be missing from screenshots MUST allow `null`
 *    Example:
 *      id: { type: ["string", "null"] }
 * 3. Nullable enums must include `null` in both `type` and `enum`
 * 4. Arrays should exist and default to [] instead of being nullable
 * 5. Nested objects must also define:
 *      - additionalProperties: false
 *      - required: [...]
 * 6. If you add a field here, you MUST also update:
 *      - src/schemas/universal-ticket.ts
 *      - src/lib/utils/ticket-null-normalizer.ts
 */

// See schema maintenance checklist: src/lib/utils/schema-maintenance-checklist.ts

export const ticketAnalysisJsonSchema = {
  name: "ticket_analysis_result",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      ticket: {
        type: "object",
        additionalProperties: false,
        properties: {
          source: {
            type: "string",
            enum: ["jira", "azure", "github", "unknown"],
          },

          id: { type: ["string", "null"] },
          key: { type: ["string", "null"] },
          project: { type: ["string", "null"] },
          url: { type: ["string", "null"] },

          kind: {
            type: "string",
            enum: [
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
            ],
          },

          title: { type: "string" },
          description: { type: ["string", "null"] },

          statusRaw: { type: ["string", "null"] },

          statusCategory: {
            type: "string",
            enum: [
              "backlog",
              "todo",
              "in_progress",
              "review",
              "testing",
              "blocked",
              "done",
              "cancelled",
              "unknown",
            ],
          },

          priorityRaw: { type: ["string", "null"] },

          priorityNormalized: {
            type: ["string", "null"],
            enum: [
              "lowest",
              "low",
              "medium",
              "high",
              "highest",
              "critical",
              "unknown",
              null,
            ],
          },

          assignee: { type: ["string", "null"] },
          reporter: { type: ["string", "null"] },
          createdBy: { type: ["string", "null"] },

          sprint: { type: ["string", "null"] },
          milestone: { type: ["string", "null"] },

          storyPoints: { type: ["number", "null"] },
          originalEstimateHours: { type: ["number", "null"] },
          remainingWorkHours: { type: ["number", "null"] },
          completedWorkHours: { type: ["number", "null"] },

          dueDate: { type: ["string", "null"] },

          parentKey: { type: ["string", "null"] },
          parentTitle: { type: ["string", "null"] },
          epicKey: { type: ["string", "null"] },
          epicTitle: { type: ["string", "null"] },

          children: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                key: { type: ["string", "null"] },
                title: { type: "string" },
                kind: {
                  type: ["string", "null"],
                  enum: [
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
                    null,
                  ],
                },
              },
              required: ["key", "title", "kind"],
            },
          },

          labels: {
            type: "array",
            items: { type: "string" },
          },

          components: {
            type: "array",
            items: { type: "string" },
          },

          areaPath: { type: ["string", "null"] },
          iterationPath: { type: ["string", "null"] },

          fixVersions: {
            type: "array",
            items: { type: "string" },
          },

          acceptanceCriteria: {
            type: "array",
            items: { type: "string" },
          },

          reproductionSteps: {
            type: "array",
            items: { type: "string" },
          },

          expectedBehavior: { type: ["string", "null"] },
          actualBehavior: { type: ["string", "null"] },
          environment: { type: ["string", "null"] },

          comments: {
            type: "array",
            items: { type: "string" },
          },

          attachments: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: ["string", "null"] },
                type: { type: ["string", "null"] },
              },
              required: ["name", "type"],
            },
          },

          extractedFromScreenshots: { type: "boolean" },

	          sourceScreenshotsCount: { type: ["number", "null"] },

	          rawExtractedText: { type: ["string", "null"] },

	          missingCriticalFields: {
	            type: "array",
	            items: { type: "string" },
	          },
	        },

        required: [
          "source",
          "id",
          "key",
          "project",
          "url",
          "kind",
          "title",
          "description",
          "statusRaw",
          "statusCategory",
          "priorityRaw",
          "priorityNormalized",
          "assignee",
          "reporter",
          "createdBy",
          "sprint",
          "milestone",
          "storyPoints",
          "originalEstimateHours",
          "remainingWorkHours",
          "completedWorkHours",
          "dueDate",
          "parentKey",
          "parentTitle",
          "epicKey",
          "epicTitle",
          "children",
          "labels",
          "components",
          "areaPath",
          "iterationPath",
          "fixVersions",
          "acceptanceCriteria",
          "reproductionSteps",
          "expectedBehavior",
          "actualBehavior",
          "environment",
	          "comments",
	          "attachments",
	          "extractedFromScreenshots",
	          "sourceScreenshotsCount",
	          "rawExtractedText",
	          "missingCriticalFields",
	        ],
	      },

      missingCriticalFields: {
        type: "array",
        items: { type: "string" },
      },

      lowConfidenceFields: {
        type: "array",
        items: { type: "string" },
      },

      notes: {
        type: "array",
        items: { type: "string" },
      },

      extractionWarnings: {
        type: "array",
        items: { type: "string" },
      },
    },

    required: [
      "ticket",
      "missingCriticalFields",
      "lowConfidenceFields",
      "notes",
      "extractionWarnings",
    ],
  },
};
