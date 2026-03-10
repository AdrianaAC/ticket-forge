// lib/tickets/ticket-field-helpers.ts
import type { UniversalTicket } from "@/types/universal-ticket";

const TOP_LEVEL_FIELDS = new Set([
  "title",
  "description",
  "priority",
  "assignee",
  "status",
  "title",
]);

export function getTicketFieldValue(
  ticket: UniversalTicket,
  fieldKey: string
): string {
  if (TOP_LEVEL_FIELDS.has(fieldKey)) {
    const value = ticket[fieldKey as keyof UniversalTicket];
    return typeof value === "string" ? value : "";
  }

  const value = ticket.fields?.[fieldKey];
  return typeof value === "string" ? value : "";
}

export function setTicketFieldValue(
  ticket: UniversalTicket,
  fieldKey: string,
  value: string
): UniversalTicket {
  if (TOP_LEVEL_FIELDS.has(fieldKey)) {
    return {
      ...ticket,
      [fieldKey]: value,
    };
  }

  return {
    ...ticket,
    fields: {
      ...(ticket.fields ?? {}),
      [fieldKey]: value,
    },
  };
}