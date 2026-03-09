/**
 * TicketForge Schema Maintenance Checklist
 *
 * Run through this checklist whenever adding or modifying fields
 * related to ticket extraction.
 *
 * 1️⃣ OpenAI Schema
 * File: src/lib/openai-ticket-schema.ts
 *
 * - Add the new field to `properties`
 * - If field may be missing from screenshots → make it nullable
 *     Example:
 *       fieldName: { type: ["string", "null"] }
 * - Add the field name to the `required` array
 * - If enum is nullable → include null in enum list
 *
 *
 * 2️⃣ Zod Schema
 * File: src/schemas/universal-ticket.ts
 *
 * - Add matching field
 * - If nullable in OpenAI schema → use:
 *
 *     z.string().nullable().optional()
 *     z.number().nullable().optional()
 *     enumSchema.nullable().optional()
 *
 *
 * 3️⃣ Null Normalization
 * File: src/lib/utils/ticket-null-normalizer.ts
 *
 * - Add the new field to normalization
 *
 *     ticket.fieldName = nullToUndefined(ticket.fieldName)
 *
 *
 * 4️⃣ Nested Objects
 *
 * If adding nested structures:
 *
 * - Must include:
 *     additionalProperties: false
 *     required: [...]
 *
 *
 * 5️⃣ Arrays
 *
 * Arrays should usually exist and default to []
 * instead of being nullable.
 *
 *
 * 6️⃣ After Editing Schema
 *
 * Test with screenshots where fields are:
 *
 * - visible
 * - missing
 * - partially cropped
 * - completely absent
 *
 *
 * This prevents strict schema failures in OpenAI structured outputs.
 */
export {};