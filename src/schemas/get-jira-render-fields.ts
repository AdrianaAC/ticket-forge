import { jiraTicketSchema } from "@/schemas/jira-ticket-schema";

export function getJiraRenderFields() {
  return {
    ...jiraTicketSchema.core,
    ...jiraTicketSchema.relationships,
    ...jiraTicketSchema.custom_fields,
  };
}
