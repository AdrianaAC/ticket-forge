export type NormalizedTicket = {
  source: "jira" | "azure" | "github" | "unknown";
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
