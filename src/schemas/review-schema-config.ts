import { azureDevopsTicketSchema } from "@/schemas/azure-ticket-schema";
import { jiraTicketSchema } from "@/schemas/jira-ticket-schema";
import type { TicketSource } from "@/types/universal-ticket";

export type ReviewSchemaField = {
  type: string;
  input_type: string;
  required?: boolean;
  description: string;
  allowed_values?: readonly (string | number)[];
  allow_custom_values?: boolean;
  pattern?: string;
};

export type ReviewSchemaSection = Record<string, ReviewSchemaField>;

export type ReviewSchemaDefinition = {
  core: ReviewSchemaSection;
  relationships: ReviewSchemaSection;
  custom_fields: ReviewSchemaSection;
};

export type ReviewSectionConfig = {
  id: "core" | "relationships" | "custom";
  title: string;
  fieldKeys: string[];
};

type ReviewConfig = {
  label: string;
  schema: ReviewSchemaDefinition;
  strictPrefilledDropdownFields: ReadonlySet<string>;
};

const JIRA_STRICT_PREFILLED_DROPDOWNS = new Set([
  "status",
  "priority",
  "urgency",
  "impact",
  "pending_reason",
]);

const AZURE_STRICT_PREFILLED_DROPDOWNS = new Set<string>([]);

export function getReviewConfig(source: TicketSource): ReviewConfig | null {
  switch (source) {
    case "jira":
      return {
        label: "Jira",
        schema: jiraTicketSchema,
        strictPrefilledDropdownFields: JIRA_STRICT_PREFILLED_DROPDOWNS,
      };
    case "azure":
      return {
        label: "Azure DevOps",
        schema: azureDevopsTicketSchema,
        strictPrefilledDropdownFields: AZURE_STRICT_PREFILLED_DROPDOWNS,
      };
    default:
      return null;
  }
}

export function getReviewRenderFields(schema: ReviewSchemaDefinition) {
  return {
    ...schema.core,
    ...schema.relationships,
    ...schema.custom_fields,
  };
}

export function getReviewSectionConfigs(
  schema: ReviewSchemaDefinition,
): ReviewSectionConfig[] {
  return [
    {
      id: "core",
      title: "Core fields",
      fieldKeys: Object.keys(schema.core),
    },
    {
      id: "relationships",
      title: "Relationships",
      fieldKeys: Object.keys(schema.relationships),
    },
    {
      id: "custom",
      title: "Custom fields",
      fieldKeys: Object.keys(schema.custom_fields),
    },
  ];
}
