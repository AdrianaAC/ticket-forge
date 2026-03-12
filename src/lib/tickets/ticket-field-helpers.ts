// lib/tickets/ticket-field-helpers.ts
import type { UniversalTicket } from "@/types/universal-ticket";
import {
  normalizeKind,
  normalizePriority,
  normalizeStatusCategory,
} from "@/lib/ticket-normalizers";

const ISSUE_KEY_PATTERN = /\b([A-Z][A-Z0-9]+-\d+)\b/i;
const HOURS_PER_DAY = 8;
const DAYS_PER_WEEK = 5;

function getConfidenceKeysForField(fieldKey: string): string[] {
  switch (fieldKey) {
    case "project":
      return ["project"];
    case "issue_type":
      return ["kind", "issue_type"];
    case "title":
      return ["title"];
    case "description":
      return ["description"];
    case "assignee":
      return ["assignee"];
    case "status":
      return ["statusRaw", "status"];
    case "priority":
      return ["priorityRaw", "priorityNormalized", "priority"];
    case "due_date":
      return ["dueDate", "due_date"];
    case "parent":
      return ["parentKey", "parentTitle", "epicKey", "epicTitle", "parent"];
    case "linked_issues":
      return ["children", "linked_issues"];
    case "labels":
      return ["labels"];
    case "components":
      return ["components"];
    case "creator":
      return ["createdBy", "creator"];
    case "original_estimate":
      return ["originalEstimateHours", "original_estimate"];
    case "attachments":
      return ["attachments"];
    default:
      return [fieldKey];
  }
}

function normalizeConfidenceValue(value: number): number | undefined {
  if (!Number.isFinite(value) || value < 0) return undefined;
  if (value <= 1) return value;
  if (value <= 100) return value / 100;
  return undefined;
}

export function setTicketFieldConfidence(
  ticket: UniversalTicket,
  fieldKey: string,
  confidence: number,
): UniversalTicket {
  const normalized = normalizeConfidenceValue(confidence);
  if (typeof normalized !== "number") return ticket;

  const nextConfidence = { ...(ticket.fieldConfidence ?? {}) };
  let changed = false;

  for (const key of getConfidenceKeysForField(fieldKey)) {
    if (nextConfidence[key] !== normalized) {
      nextConfidence[key] = normalized;
      changed = true;
    }
  }

  if (!changed) return ticket;

  return {
    ...ticket,
    fieldConfidence: nextConfidence,
  };
}

function clearConfidenceForField(
  ticket: UniversalTicket,
  fieldKey: string,
): UniversalTicket {
  if (!ticket.fieldConfidence) return ticket;

  const nextConfidence = { ...ticket.fieldConfidence };
  let changed = false;

  for (const key of getConfidenceKeysForField(fieldKey)) {
    if (key in nextConfidence) {
      delete nextConfidence[key];
      changed = true;
    }
  }

  if (!changed) return ticket;

  return {
    ...ticket,
    fieldConfidence:
      Object.keys(nextConfidence).length > 0 ? nextConfidence : undefined,
  };
}

function cleanString(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function splitList(value: string): string[] {
  return value
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function joinList(items: string[] | undefined): string {
  if (!items || items.length === 0) return "";
  return items.join(", ");
}

function formatIssueType(kind: string | undefined): string {
  switch (kind) {
    case "epic":
      return "Epic";
    case "feature":
      return "Feature";
    case "story":
      return "Story";
    case "task":
      return "Task";
    case "bug":
      return "Bug";
    case "subtask":
      return "Sub-task";
    case "spike":
      return "Spike";
    case "improvement":
      return "Improvement";
    case "issue":
      return "Issue";
    case "pbi":
      return "PBI";
    default:
      return "";
  }
}

function formatIssueReference(key?: string, title?: string): string {
  if (key && title) return `${key} - ${title}`;
  return key ?? title ?? "";
}

function parseIssueReference(value: string): {
  key?: string;
  title?: string;
} {
  const trimmed = value.trim();
  if (!trimmed) return {};

  const keyMatch = trimmed.match(ISSUE_KEY_PATTERN);
  if (!keyMatch) return { title: trimmed };

  const key = keyMatch[1].toUpperCase();
  const withoutKey = trimmed.replace(keyMatch[0], "").trim();
  const title = withoutKey.replace(/^[-:\s]+/, "").trim();

  return {
    key,
    title: title.length > 0 ? title : undefined,
  };
}

function formatEstimateHours(hours?: number): string {
  if (typeof hours !== "number" || Number.isNaN(hours)) return "";
  if (Number.isInteger(hours)) return `${hours}h`;
  return `${hours.toFixed(2)}h`;
}

function parseEstimateHours(value: string): number | undefined {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return undefined;

  const rawNumber = Number(trimmed);
  if (!Number.isNaN(rawNumber)) {
    return rawNumber;
  }

  let totalHours = 0;

  const weekMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*w/);
  const dayMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*d/);
  const hourMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*h/);
  const minuteMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*m/);

  if (weekMatch) {
    totalHours += Number(weekMatch[1]) * DAYS_PER_WEEK * HOURS_PER_DAY;
  }
  if (dayMatch) {
    totalHours += Number(dayMatch[1]) * HOURS_PER_DAY;
  }
  if (hourMatch) {
    totalHours += Number(hourMatch[1]);
  }
  if (minuteMatch) {
    totalHours += Number(minuteMatch[1]) / 60;
  }

  return totalHours > 0 ? Number(totalHours.toFixed(2)) : undefined;
}

function toDisplayString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string").join(", ");
  }
  return "";
}

function getMappedFieldValue(
  ticket: UniversalTicket,
  fieldKey: string,
): string | undefined {
  switch (fieldKey) {
    case "project":
      return ticket.project ?? "";
    case "issue_type":
      return formatIssueType(ticket.kind);
    case "title":
      return ticket.title ?? "";
    case "description":
      return ticket.description ?? "";
    case "assignee":
      return ticket.assignee ?? "";
    case "status":
      return ticket.statusRaw ?? ticket.status ?? "";
    case "priority":
      return ticket.priorityRaw ?? ticket.priority ?? ticket.priorityNormalized ?? "";
    case "due_date":
      return ticket.dueDate ?? "";
    case "parent":
      return formatIssueReference(
        ticket.parentKey ?? ticket.epicKey,
        ticket.parentTitle ?? ticket.epicTitle,
      );
    case "linked_issues":
      return ticket.children?.length
        ? ticket.children
            .map((child) => formatIssueReference(child.key, child.title))
            .join("; ")
        : "";
    case "labels":
      return joinList(ticket.labels);
    case "components":
      return joinList(ticket.components);
    case "creator":
      return ticket.createdBy ?? "";
    case "original_estimate":
      return formatEstimateHours(ticket.originalEstimateHours);
    case "attachments":
      return ticket.attachments
        .map((att) => att.name)
        .filter((name): name is string => !!name && name.trim().length > 0)
        .join(", ");
    default:
      return undefined;
  }
}

export function getTicketFieldValue(
  ticket: UniversalTicket,
  fieldKey: string,
): string {
  const mapped = getMappedFieldValue(ticket, fieldKey);
  if (mapped !== undefined) return mapped;

  const value = ticket.fields?.[fieldKey];
  if (typeof value === "string") return value;

  const customValue = ticket.customFields?.[fieldKey];
  return toDisplayString(customValue);
}

export function getTicketFieldConfidence(
  ticket: UniversalTicket,
  fieldKey: string,
): number | undefined {
  const confidenceByField = ticket.fieldConfidence;
  if (!confidenceByField) return undefined;

  const candidates = getConfidenceKeysForField(fieldKey);
  const normalizedValues = candidates
    .map((key) => confidenceByField[key])
    .filter((value): value is number => typeof value === "number")
    .map(normalizeConfidenceValue)
    .filter((value): value is number => typeof value === "number");

  if (normalizedValues.length === 0) return undefined;
  return Math.min(...normalizedValues);
}

export function setTicketFieldValue(
  ticket: UniversalTicket,
  fieldKey: string,
  value: string,
): UniversalTicket {
  const finalize = (nextTicket: UniversalTicket) =>
    clearConfidenceForField(nextTicket, fieldKey);

  switch (fieldKey) {
    case "project":
      return finalize({ ...ticket, project: cleanString(value) });
    case "issue_type":
      return finalize({ ...ticket, kind: normalizeKind(value) });
    case "title":
      return finalize({ ...ticket, title: value });
    case "description":
      return finalize({ ...ticket, description: cleanString(value) });
    case "assignee":
      return finalize({ ...ticket, assignee: cleanString(value) });
    case "status": {
      const statusRaw = cleanString(value);
      return finalize({
        ...ticket,
        statusRaw,
        statusCategory: normalizeStatusCategory(statusRaw),
      });
    }
    case "priority": {
      const priorityRaw = cleanString(value);
      return finalize({
        ...ticket,
        priorityRaw,
        priorityNormalized: normalizePriority(priorityRaw),
      });
    }
    case "due_date":
      return finalize({ ...ticket, dueDate: cleanString(value) });
    case "parent": {
      const parent = parseIssueReference(value);
      return finalize({
        ...ticket,
        parentKey: parent.key,
        parentTitle: parent.title,
      });
    }
    case "labels":
      return finalize({ ...ticket, labels: splitList(value) });
    case "components":
      return finalize({ ...ticket, components: splitList(value) });
    case "creator":
      return finalize({ ...ticket, createdBy: cleanString(value) });
    case "original_estimate":
      return finalize({
        ...ticket,
        originalEstimateHours: parseEstimateHours(value),
      });
    case "attachments":
      return finalize({
        ...ticket,
        attachments: splitList(value).map((name) => ({ name })),
      });
  }

  const trimmed = value.trim();
  return finalize({
    ...ticket,
    fields: {
      ...(ticket.fields ?? {}),
      [fieldKey]: value,
    },
    customFields: {
      ...(ticket.customFields ?? {}),
      [fieldKey]: trimmed.length > 0 ? value : null,
    },
  });
}
