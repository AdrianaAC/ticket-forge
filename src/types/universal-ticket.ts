export type TicketSource = "jira" | "azure" | "github" | "unknown";

export interface UniversalTicket {
  source: TicketSource;
  id?: string;
  key?: string;
  project?: string;
  url?: string;
  kind: string;
  title: string;
  description?: string;
  status?: string;
  statusRaw?: string;
  statusCategory: string;
  priority?: string;
  priorityRaw?: string;
  priorityNormalized?: string;
  assignee?: string;
  reporter?: string;
  createdBy?: string;
  sprint?: string;
  milestone?: string;
  storyPoints?: number;
  originalEstimateHours?: number;
  remainingWorkHours?: number;
  completedWorkHours?: number;
  dueDate?: string;
  parentKey?: string;
  parentTitle?: string;
  epicKey?: string;
  epicTitle?: string;
  children?: Array<{
    key?: string;
    title: string;
    kind?: string;
  }>;
  labels: string[];
  components: string[];
  areaPath?: string;
  iterationPath?: string;
  fixVersions: string[];
  acceptanceCriteria: string[];
  reproductionSteps: string[];
  expectedBehavior?: string;
  actualBehavior?: string;
  environment?: string;
  comments: string[];
  attachments: Array<{
    name?: string;
    type?: string;
  }>;
  extractedFromScreenshots: boolean;
  sourceScreenshotsCount?: number;
  rawText?: string;
  rawExtractedText?: string;
  fieldConfidence?: Partial<Record<string, number>>;
  missingCriticalFields?: string[];
  customFields?: Record<string, string | number | boolean | string[] | null>;
  fields?: Record<string, unknown>;
}

export interface TicketAnalysisResult {
  ticket: UniversalTicket;
  missingCriticalFields: string[];
  lowConfidenceFields: string[];
  notes: string[];
  extractionWarnings: string[];
}