import type {
  TicketSource,
  UniversalTicket,
} from "@/types/universal-ticket";

type TicketKind =
  | "epic"
  | "feature"
  | "story"
  | "task"
  | "bug"
  | "subtask"
  | "issue"
  | "spike"
  | "improvement"
  | "pbi"
  | "unknown";

type TicketPriority =
  | "lowest"
  | "low"
  | "medium"
  | "high"
  | "highest"
  | "critical"
  | "unknown";

type TicketStatusCategory =
  | "backlog"
  | "todo"
  | "in_progress"
  | "review"
  | "testing"
  | "blocked"
  | "done"
  | "cancelled"
  | "unknown";

export function normalizeKind(value?: string): TicketKind {
  const v = value?.trim().toLowerCase();

  if (!v) return "unknown";
  if (v.includes("epic")) return "epic";
  if (v.includes("feature")) return "feature";
  if (v.includes("story")) return "story";
  if (v.includes("task")) return "task";
  if (v.includes("bug")) return "bug";
  if (v.includes("subtask") || v.includes("sub-task")) return "subtask";
  if (v.includes("spike")) return "spike";
  if (v.includes("improvement")) return "improvement";
  if (v.includes("product backlog item") || v === "pbi") return "pbi";
  if (v.includes("issue")) return "issue";

  return "unknown";
}

export function normalizePriority(value?: string): TicketPriority {
  const v = value?.trim().toLowerCase();

  if (!v) return "unknown";
  if (v.includes("critical")) return "critical";
  if (v.includes("highest")) return "highest";
  if (v === "high") return "high";
  if (v === "medium" || v === "med") return "medium";
  if (v === "low") return "low";
  if (v.includes("lowest")) return "lowest";

  return "unknown";
}

export function normalizeStatusCategory(value?: string): TicketStatusCategory {
  const v = value?.trim().toLowerCase();

  if (!v) return "unknown";
  if (v.includes("backlog")) return "backlog";
  if (v.includes("to do") || v === "todo" || v === "new") return "todo";
  if (v.includes("progress") || v === "active") return "in_progress";
  if (v.includes("review") || v.includes("code review")) return "review";
  if (v.includes("test") || v === "qa") return "testing";
  if (v.includes("block")) return "blocked";
  if (v.includes("done") || v.includes("closed") || v.includes("resolved"))
    return "done";
  if (v.includes("cancel")) return "cancelled";

  return "unknown";
}

export function getMissingCriticalFields(ticket: UniversalTicket): string[] {
  const missing: string[] = [];

  if (!ticket.source || ticket.source === "unknown") missing.push("source");
  if (!ticket.kind || ticket.kind === "unknown") missing.push("kind");
  if (!ticket.title?.trim()) missing.push("title");
  if (!ticket.description?.trim()) missing.push("description");
  if (!ticket.statusRaw?.trim()) missing.push("statusRaw");

  return missing;
}

export function createEmptyUniversalTicket(
  source: TicketSource,
  screenshotsCount: number,
): UniversalTicket {
  return {
    source,
    kind: "unknown",
    title: "",
    statusCategory: "unknown",
    labels: [],
    components: [],
    fixVersions: [],
    acceptanceCriteria: [],
    reproductionSteps: [],
    comments: [],
    attachments: [],
    extractedFromScreenshots: true,
    sourceScreenshotsCount: screenshotsCount,
    customFields: {},
  };
}
