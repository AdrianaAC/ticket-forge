// lib/schemas/jira-ticket-schema.ts
export const jiraTicketSchema = {
  entity: "jira_ticket",
  required_fields: ["space", "work_type", "request_type", "title"],
  fields: {
    space: {
      type: "string",
      input_type: "dropdown",
      required: true,
      description:
        "Project space where the ticket will be created. Determines workflows, permissions, and configuration.",
      allowed_values: ["personal (PER)", "Demo service space (DEMO)"],
      allow_custom_values: true,
    },
    work_type: {
      type: "string",
      input_type: "dropdown",
      required: true,
      description: "Defines the type of work item and associated workflow.",
      allowed_values: [
        "Task",
        "[System] Service request",
        "[System] Incident",
        "[System] Service request with approvals",
      ],
      allow_custom_values: false,
    },
    request_type: {
      type: "string",
      input_type: "dropdown",
      required: true,
      description:
        "Defines the service desk request category visible in the customer portal.",
      allowed_values: ["No request type"],
      allow_custom_values: true,
    },
    title: {
      type: "string",
      input_type: "text",
      required: true,
      description: "Short title describing the task or issue.",
    },
    description: {
      type: "string",
      input_type: "rich_text",
      required: false,
      description:
        "Detailed explanation of the task including reproduction steps, context, and technical notes.",
    },
    priority: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description: "Relative importance of the issue.",
      allowed_values: ["Highest", "High", "Medium", "Low", "Lowest"],
      allow_custom_values: true,
    },
    urgency: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description: "How quickly the issue must be addressed.",
      allowed_values: ["Critical", "High", "Medium", "Low"],
      allow_custom_values: true,
    },
    impact: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description: "Scale of the issue in terms of affected users or services.",
      allowed_values: [
        "Extensive / Widespread",
        "Significant / Large",
        "Moderate / Limited",
        "Minor / Localized",
      ],
      allow_custom_values: true,
    },
  },
} as const;
