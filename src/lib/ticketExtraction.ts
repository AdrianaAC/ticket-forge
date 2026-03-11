import type { TicketSource } from "@/types/ticket";

export function buildSourceSpecificGuidance(source: TicketSource) {
  switch (source) {
    case "jira":
      return `
This is a Jira ticket screenshot.
Common fields may include:
- issue key
- title
- description
- acceptance criteria
- labels
- priority
- story points
- assignee
- comments
`;
    case "azure":
      return `
This is an Azure DevOps work item screenshot.
Common fields may include:
- ID
- title
- description
- acceptance criteria
- reproduction steps
- priority
- story points / effort
- assigned to
- comments / discussion
`;
    case "github":
      return `
This is a GitHub issue screenshot.
Common fields may include:
- issue number
- title
- body/description
- labels
- assignees
- comments
`;
    default:
      return `
This is a ticket or issue screenshot from an unknown system.
Extract the most likely ticket fields from the visible content.
`;
  }
}

export const ticketJsonSchema = {
  name: "normalized_ticket",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      source: {
        type: "string",
        enum: ["jira", "azure", "github", "unknown"],
      },
      title: { type: "string" },
      ticketId: { type: "string" },
      type: { type: "string" },
      description: { type: "string" },
      acceptanceCriteria: {
        type: "array",
        items: { type: "string" },
      },
      comments: {
        type: "array",
        items: { type: "string" },
      },
      labels: {
        type: "array",
        items: { type: "string" },
      },
      priority: { type: "string" },
      storyPoints: { type: "number" },
      assignee: { type: "string" },
      rawExtractedText: { type: "string" },
    },
    required: ["source", "title", "acceptanceCriteria", "comments", "labels"],
  },
};