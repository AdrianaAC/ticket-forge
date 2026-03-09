export type TicketSource = "jira" | "azure" | "github" | "unknown";

export type NormalizedTicket = {
  status?: string;
  kind?: string;
  project?: string;
  url?: string;
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
