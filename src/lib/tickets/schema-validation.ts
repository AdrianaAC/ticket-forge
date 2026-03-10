// lib/tickets/schema-validation.ts
import type { UniversalTicket } from "@/types/universal-ticket";
import { getTicketFieldValue } from "@/lib/tickets/ticket-field-helpers";

type SchemaField = {
  required?: boolean;
};

type Schema = {
  fields: Record<string, SchemaField>;
};

export function isEmptyValue(value: string) {
  return value.trim() === "";
}

export function getMissingRequiredFields(
  ticket: UniversalTicket,
  schema: Schema
): string[] {
  return Object.entries(schema.fields)
    .filter(([, fieldDef]) => fieldDef.required)
    .map(([fieldKey]) => fieldKey)
    .filter((fieldKey) => isEmptyValue(getTicketFieldValue(ticket, fieldKey)));
}

export function hasMissingRequiredFields(
  ticket: UniversalTicket,
  schema: Schema
): boolean {
  return getMissingRequiredFields(ticket, schema).length > 0;
}