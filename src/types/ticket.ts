export type TicketSource = "jira" | "azure" | "github" | "unknown";

export type NormalizedTicket = {
  source: TicketSource;
  title: string;
  ticketId?: string;
  type?: string;
  description?: string;
  acceptanceCriteria: string[];
  comments: string[];
  labels: string[];
  priority?: string;
  storyPoints?: number;
  assignee?: string;
  rawExtractedText?: string;
};