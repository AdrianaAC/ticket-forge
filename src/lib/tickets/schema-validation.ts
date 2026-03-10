import type { UniversalTicket } from "@/types/universal-ticket";
import { getTicketFieldValue } from "@/lib/tickets/ticket-field-helpers";

type SchemaField = {
  required?: boolean;
};

type FlatSchema = Record<string, SchemaField>;

export function isEmptyValue(value: string) {
  return value.trim() === "";
}

export function getMissingRequiredFields(
  ticket: UniversalTicket,
  fields: FlatSchema,
): string[] {
  return Object.entries(fields)
    .filter(([, fieldDef]) => fieldDef.required)
    .map(([fieldKey]) => fieldKey)
    .filter((fieldKey) => isEmptyValue(getTicketFieldValue(ticket, fieldKey)));
}

export function hasMissingRequiredFields(
  ticket: UniversalTicket,
  fields: FlatSchema,
): boolean {
  return getMissingRequiredFields(ticket, fields).length > 0;
}
