"use client";

import { useMemo, useState } from "react";
import type { UniversalTicket } from "@/types/universal-ticket";
import {
  getTicketFieldConfidence,
  getTicketFieldValue,
  setTicketFieldValue,
} from "@/lib/tickets/ticket-field-helpers";
import EditableDropdown from "@/components/EditableDropdown";
import { getJiraRenderFields } from "@/schemas/get-jira-render-fields";
import { jiraTicketSchema } from "@/schemas/jira-ticket-schema";

type Props = {
  ticket: UniversalTicket;
  onChange: (ticket: UniversalTicket) => void;
};

type FieldFilter = "all" | "empty" | "low_confidence";

type SectionConfig = {
  id: "core" | "relationships" | "custom";
  title: string;
  fieldKeys: string[];
};

type FieldState = {
  value: string;
  isEmptyValue: boolean;
  isLowConfidence: boolean;
  confidence?: number;
};

function toLabel(key: string) {
  return key
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isEmpty(value: string) {
  return value.trim() === "";
}

function formatConfidence(confidence: number) {
  return `${Math.round(confidence * 100)}%`;
}

const LOW_CONFIDENCE_THRESHOLD = 0.75;

export default function JiraSchemaReviewFields({ ticket, onChange }: Props) {
  const renderFields = useMemo(() => getJiraRenderFields(), []);
  const fieldEntries = useMemo(() => Object.entries(renderFields), [renderFields]);

  const sectionConfigs = useMemo<SectionConfig[]>(
    () => [
      {
        id: "core",
        title: "Core fields",
        fieldKeys: Object.keys(jiraTicketSchema.core),
      },
      {
        id: "relationships",
        title: "Relationships",
        fieldKeys: Object.keys(jiraTicketSchema.relationships),
      },
      {
        id: "custom",
        title: "Custom fields",
        fieldKeys: Object.keys(jiraTicketSchema.custom_fields),
      },
    ],
    [],
  );

  const [customOptions, setCustomOptions] = useState<Record<string, string[]>>(
    {},
  );
  const [filter, setFilter] = useState<FieldFilter>("all");
  const [openSections, setOpenSections] = useState<Record<SectionConfig["id"], boolean>>({
    core: true,
    relationships: false,
    custom: false,
  });

  const mergedOptions = useMemo(() => {
    const result: Record<string, string[]> = {};

    for (const [fieldKey, fieldDef] of fieldEntries) {
      const baseOptions =
        "allowed_values" in fieldDef && Array.isArray(fieldDef.allowed_values)
          ? [...fieldDef.allowed_values]
          : [];

      const extraOptions = customOptions[fieldKey] ?? [];
      result[fieldKey] = Array.from(new Set([...baseOptions, ...extraOptions]));
    }

    return result;
  }, [fieldEntries, customOptions]);

  const fieldStateByKey = useMemo(() => {
    const entries = fieldEntries.map(([fieldKey]) => {
      const value = getTicketFieldValue(ticket, fieldKey);
      const confidence = getTicketFieldConfidence(ticket, fieldKey);
      const isEmptyValue = isEmpty(value);
      const isLowConfidence =
        !isEmptyValue &&
        typeof confidence === "number" &&
        confidence < LOW_CONFIDENCE_THRESHOLD;

      return [
        fieldKey,
        {
          value,
          isEmptyValue,
          isLowConfidence,
          confidence,
        } satisfies FieldState,
      ] as const;
    });

    return Object.fromEntries(entries) as Record<string, FieldState>;
  }, [fieldEntries, ticket]);

  const lowConfidenceCount = useMemo(() => {
    return Object.values(fieldStateByKey).reduce((count, state) => {
      return state.isLowConfidence ? count + 1 : count;
    }, 0);
  }, [fieldStateByKey]);

  const emptyFieldsCount = useMemo(() => {
    return Object.values(fieldStateByKey).reduce((count, state) => {
      return state.isEmptyValue ? count + 1 : count;
    }, 0);
  }, [fieldStateByKey]);

  const filteredFieldsCount = useMemo(() => {
    if (filter === "all") return fieldEntries.length;
    if (filter === "empty") return emptyFieldsCount;
    return lowConfidenceCount;
  }, [filter, fieldEntries.length, emptyFieldsCount, lowConfidenceCount]);

  const matchesFilter = (state: FieldState) => {
    if (filter === "all") return true;
    if (filter === "empty") return state.isEmptyValue;
    return state.isLowConfidence;
  };

  const addCustomOption = (fieldKey: string, newValue: string) => {
    const trimmed = newValue.trim();
    if (!trimmed) return;

    const fieldDef = renderFields[fieldKey as keyof typeof renderFields];

    const baseOptions =
      "allowed_values" in fieldDef && Array.isArray(fieldDef.allowed_values)
        ? fieldDef.allowed_values
        : [];

    setCustomOptions((prev) => {
      const existing = prev[fieldKey] ?? [];

      const alreadyExists = [...baseOptions, ...existing].some(
        (option) => option.toLowerCase() === trimmed.toLowerCase(),
      );

      if (alreadyExists) return prev;

      return {
        ...prev,
        [fieldKey]: [...existing, trimmed],
      };
    });
  };

  const toggleSection = (sectionId: SectionConfig["id"]) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-white">Jira fields</h3>
        <p className="mt-1 text-xs text-zinc-400">
          {fieldEntries.length} total fields | {emptyFieldsCount} currently empty
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={[
            "rounded-md border px-3 py-1.5 text-xs font-medium transition",
            filter === "all"
              ? "border-zinc-500 bg-zinc-800 text-zinc-100"
              : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-200",
          ].join(" ")}
        >
          All ({fieldEntries.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("empty")}
          className={[
            "rounded-md border px-3 py-1.5 text-xs font-medium transition",
            filter === "empty"
              ? "border-amber-600 bg-amber-950/50 text-amber-200"
              : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-200",
          ].join(" ")}
        >
          Only empty ({emptyFieldsCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter("low_confidence")}
          className={[
            "rounded-md border px-3 py-1.5 text-xs font-medium transition",
            filter === "low_confidence"
              ? "border-amber-500 bg-amber-950/50 text-amber-200"
              : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-200",
          ].join(" ")}
        >
          Only low-confidence ({lowConfidenceCount})
        </button>
      </div>

      {lowConfidenceCount > 0 ? (
        <div className="rounded-xl border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
          {lowConfidenceCount} field
          {lowConfidenceCount === 1 ? "" : "s"} extracted with low confidence.
          Please verify highlighted values.
        </div>
      ) : null}

      {filteredFieldsCount === 0 ? (
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
          No fields match the active filter.
        </div>
      ) : null}

      <div className="space-y-3">
        {sectionConfigs.map((section) => {
          const visibleEntries = section.fieldKeys
            .map((fieldKey) => {
              const fieldDef = renderFields[fieldKey as keyof typeof renderFields];
              const state = fieldStateByKey[fieldKey];
              if (!fieldDef || !state) return null;
              if (!matchesFilter(state)) return null;
              return [fieldKey, fieldDef] as const;
            })
            .filter((entry): entry is readonly [string, (typeof renderFields)[keyof typeof renderFields]] => Boolean(entry));

          const isOpen = openSections[section.id];

          return (
            <div
              key={section.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/80"
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-100">
                    {section.title}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {visibleEntries.length} field
                    {visibleEntries.length === 1 ? "" : "s"} shown
                  </p>
                </div>
                <span className="text-xs text-zinc-400">
                  {isOpen ? "Hide" : "Show"}
                </span>
              </button>

              {isOpen ? (
                <div className="border-t border-zinc-800 p-4">
                  {visibleEntries.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                      No fields in this section match the active filter.
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {visibleEntries.map(([fieldKey, fieldDef]) => {
                        const state = fieldStateByKey[fieldKey];
                        const value = state.value;
                        const label = toLabel(fieldKey);
                        const isEmptyValue = state.isEmptyValue;
                        const isRequired = !!fieldDef.required;
                        const isInvalid = isRequired && isEmptyValue;
                        const isLowConfidence = !isInvalid && state.isLowConfidence;
                        const isEmptyField = isEmptyValue && !isInvalid;
                        const confidence = state.confidence;

                        const baseClasses =
                          "w-full rounded-xl border bg-zinc-950 px-4 py-3 text-sm text-white focus:outline-none";
                        const validClasses =
                          "border-zinc-700 placeholder:text-zinc-500 focus:border-zinc-500";
                        const invalidClasses =
                          "border-red-500 text-red-100 placeholder:text-transparent focus:border-red-400";
                        const lowConfidenceClasses =
                          "border-amber-500 text-amber-100 placeholder:text-amber-300/40 focus:border-amber-400";
                        const emptyFieldClasses =
                          "border-amber-700 bg-amber-950/30 text-amber-100 placeholder:text-transparent focus:border-amber-500";

                        const commonClasses = `${baseClasses} ${
                          isInvalid
                            ? invalidClasses
                            : isLowConfidence
                              ? lowConfidenceClasses
                              : isEmptyField
                                ? emptyFieldClasses
                                : validClasses
                        }`;

                        return (
                          <div
                            key={fieldKey}
                            className={
                              fieldDef.input_type === "rich_text"
                                ? "md:col-span-2"
                                : ""
                            }
                          >
                            <label className="mb-2 block text-sm font-medium text-zinc-200">
                              {label}
                              {isRequired ? (
                                <span className="ml-1 text-red-400">*</span>
                              ) : null}
                              {isLowConfidence &&
                              typeof confidence === "number" ? (
                                <span className="ml-2 rounded-md border border-amber-600/80 bg-amber-950/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                                  {formatConfidence(confidence)}
                                </span>
                              ) : null}
                            </label>

                            {fieldDef.input_type === "dropdown" &&
                            "allow_custom_values" in fieldDef &&
                            fieldDef.allow_custom_values ? (
                              <EditableDropdown
                                value={value}
                                options={mergedOptions[fieldKey] ?? []}
                                placeholder="Choose an option"
                                invalid={isInvalid}
                                warning={isLowConfidence || isEmptyField}
                                onChange={(newValue) =>
                                  onChange(
                                    setTicketFieldValue(
                                      ticket,
                                      fieldKey,
                                      newValue,
                                    ),
                                  )
                                }
                                onAddOption={(newValue) =>
                                  addCustomOption(fieldKey, newValue)
                                }
                              />
                            ) : fieldDef.input_type === "dropdown" ? (
                              <select
                                value={value}
                                onChange={(e) =>
                                  onChange(
                                    setTicketFieldValue(
                                      ticket,
                                      fieldKey,
                                      e.target.value,
                                    ),
                                  )
                                }
                                className={commonClasses}
                              >
                                {("allowed_values" in fieldDef &&
                                Array.isArray(fieldDef.allowed_values)
                                  ? fieldDef.allowed_values
                                  : []
                                ).map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : fieldDef.input_type === "rich_text" ? (
                              <textarea
                                rows={6}
                                value={value}
                                placeholder=""
                                onChange={(e) =>
                                  onChange(
                                    setTicketFieldValue(
                                      ticket,
                                      fieldKey,
                                      e.target.value,
                                    ),
                                  )
                                }
                                className={commonClasses}
                              />
                            ) : (
                              <input
                                type="text"
                                value={value}
                                placeholder=""
                                onChange={(e) =>
                                  onChange(
                                    setTicketFieldValue(
                                      ticket,
                                      fieldKey,
                                      e.target.value,
                                    ),
                                  )
                                }
                                className={commonClasses}
                              />
                            )}

                            {isEmptyValue || isInvalid || isLowConfidence ? (
                              <p className="mt-2 text-xs text-zinc-500">
                                {fieldDef.description}
                              </p>
                            ) : null}

                            {isInvalid ? (
                              <p className="mt-1 text-xs text-red-400">
                                This field is required.
                              </p>
                            ) : null}

                            {isLowConfidence &&
                            typeof confidence === "number" ? (
                              <p className="mt-1 text-xs text-amber-400">
                                Low confidence extraction (
                                {formatConfidence(confidence)}). Please verify
                                this value.
                              </p>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
