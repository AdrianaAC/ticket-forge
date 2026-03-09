import { ticketAnalysisJsonSchema } from "@/lib/openai-ticket-schema";

type JsonSchemaObject = {
  properties?: Record<string, JsonSchemaObject>;
  required?: string[];
  items?: JsonSchemaObject;
};

function collectPropertyKeys(obj: JsonSchemaObject): string[] {
  if (!obj.properties) return [];
  return Object.keys(obj.properties);
}

function validateRequiredMatchesProperties(
  obj: JsonSchemaObject,
  path: string,
) {
  if (!obj.properties) return;

  const props = collectPropertyKeys(obj);
  const required = obj.required ?? [];

  const missingInRequired = props.filter((p) => !required.includes(p));
  const missingInProperties = required.filter((r) => !props.includes(r));

  if (missingInRequired.length > 0) {
    throw new Error(
      `Schema error at ${path}: properties missing in required → ${missingInRequired.join(
        ", ",
      )}`,
    );
  }

  if (missingInProperties.length > 0) {
    throw new Error(
      `Schema error at ${path}: required keys not in properties → ${missingInProperties.join(
        ", ",
      )}`,
    );
  }
}

function traverseSchema(schema: JsonSchemaObject, path = "root") {
  if (!schema || typeof schema !== "object") return;

  validateRequiredMatchesProperties(schema, path);

  if (schema.properties) {
    for (const key of Object.keys(schema.properties)) {
      traverseSchema(schema.properties[key], `${path}.${key}`);
    }
  }

  if (schema.items) {
    traverseSchema(schema.items, `${path}[]`);
  }
}

export function validateTicketSchema() {
  traverseSchema(ticketAnalysisJsonSchema.schema as JsonSchemaObject);
}
