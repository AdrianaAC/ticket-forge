"use client";

import { useEffect, useMemo, useState } from "react";
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
  originalTicket?: UniversalTicket;
  onChange: (ticket: UniversalTicket) => void;
  onValidationStateChange?: (state: { errorsCount: number }) => void;
};

type FieldFilter = "all" | "empty" | "low_confidence";

type SectionConfig = {
  id: "core" | "relationships" | "custom";
  title: string;
  fieldKeys: string[];
};

type FieldState = {
  value: string;
  originalValue: string;
  isEmptyValue: boolean;
  isLowConfidence: boolean;
  confidence?: number;
  validationError?: string;
  isChanged: boolean;
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

function normalizeForCompare(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function formatConfidence(confidence: number) {
  return `${Math.round(confidence * 100)}%`;
}

function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return false;
  return date.toISOString().slice(0, 10) === value;
}

function getValidationError(fieldKey: string, value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (fieldKey === "due_date") {
    if (!isValidIsoDate(trimmed)) {
      return "Use a valid date in YYYY-MM-DD format.";
    }
  }

  if (fieldKey === "story_points") {
    if (!/^\d+(\.\d+)?$/.test(trimmed)) {
      return "Use a numeric value for story points.";
    }
  }

  if (fieldKey === "original_estimate") {
    if (/^\d+(\.\d+)?$/.test(trimmed)) return undefined;

    const estimatePattern =
      /^(\d+(?:\.\d+)?w)?\s*(\d+(?:\.\d+)?d)?\s*(\d+(?:\.\d+)?h)?\s*(\d+(?:\.\d+)?m)?$/i;

    if (!estimatePattern.test(trimmed) || !/[wdhm]/i.test(trimmed)) {
      return "Use hours or Jira format (e.g. 2w 1d 5h 30m).";
    }
  }

  return undefined;
}

const LOW_CONFIDENCE_THRESHOLD = 0.75;

export default function JiraSchemaReviewFields({
  ticket,
  originalTicket,
  onChange,
  onValidationStateChange,
}: Props) {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showDiff, setShowDiff] = useState(false);
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
      const originalValue = originalTicket
        ? getTicketFieldValue(originalTicket, fieldKey)
        : "";
      const confidence = getTicketFieldConfidence(ticket, fieldKey);
      const isEmptyValue = isEmpty(value);
      const isLowConfidence =
        !isEmptyValue &&
        typeof confidence === "number" &&
        confidence < LOW_CONFIDENCE_THRESHOLD;
      const validationError = getValidationError(fieldKey, value);
      const isChanged =
        normalizeForCompare(value) !== normalizeForCompare(originalValue);

      return [
        fieldKey,
        {
          value,
          originalValue,
          isEmptyValue,
          isLowConfidence,
          confidence,
          validationError,
          isChanged,
        } satisfies FieldState,
      ] as const;
    });

    return Object.fromEntries(entries) as Record<string, FieldState>;
  }, [fieldEntries, ticket, originalTicket]);

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

  const changedFieldsCount = useMemo(() => {
    return Object.values(fieldStateByKey).reduce((count, state) => {
      return state.isChanged ? count + 1 : count;
    }, 0);
  }, [fieldStateByKey]);

  const validationErrorsCount = useMemo(() => {
    return Object.values(fieldStateByKey).reduce((count, state) => {
      return state.validationError ? count + 1 : count;
    }, 0);
  }, [fieldStateByKey]);

  useEffect(() => {
    onValidationStateChange?.({ errorsCount: validationErrorsCount });
  }, [onValidationStateChange, validationErrorsCount]);

  const matchesFilter = (state: FieldState) => {
    if (filter === "all") return true;
    if (filter === "empty") return state.isEmptyValue;
    return state.isLowConfidence;
  };

  const matchesSearch = (
    fieldKey: string,
    fieldDef: (typeof renderFields)[keyof typeof renderFields],
  ) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return (
      fieldKey.toLowerCase().includes(query) ||
      toLabel(fieldKey).toLowerCase().includes(query) ||
      fieldDef.description.toLowerCase().includes(query)
    );
  };

  const filteredFieldsCount = fieldEntries.reduce((count, [fieldKey, fieldDef]) => {
    const state = fieldStateByKey[fieldKey];
    if (!state) return count;
    if (!matchesFilter(state)) return count;
    if (!matchesSearch(fieldKey, fieldDef)) return count;
    return count + 1;
  }, 0);

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
          {fieldEntries.length} total fields | {emptyFieldsCount} empty |{" "}
          {changedFieldsCount} edited
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search fields by name or description"
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-500"
        />

        <button
          type="button"
          onClick={() => setShowDiff((prev) => !prev)}
          disabled={!originalTicket}
          className={[
            "rounded-md border px-3 py-2 text-xs font-medium transition",
            !originalTicket
              ? "cursor-not-allowed border-zinc-700 bg-zinc-900 text-zinc-500"
              : showDiff
                ? "border-blue-600 bg-blue-950/40 text-blue-200"
                : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-zinc-100",
          ].join(" ")}
        >
          {showDiff ? "Hide extracted values" : "Show extracted values"} (
          {changedFieldsCount})
        </button>
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

      {validationErrorsCount > 0 ? (
        <div className="rounded-xl border border-red-800/70 bg-red-950/25 px-4 py-3 text-sm text-red-200">
          {validationErrorsCount} field
          {validationErrorsCount === 1 ? "" : "s"} has invalid format.
        </div>
      ) : null}

      {filteredFieldsCount === 0 ? (
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
          No fields match the active filter/search.
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
              if (!matchesSearch(fieldKey, fieldDef)) return null;
              return [fieldKey, fieldDef] as const;
            })
            .filter(
              (
                entry,
              ): entry is readonly [
                string,
                (typeof renderFields)[keyof typeof renderFields],
              ] => Boolean(entry),
            );

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
                      No fields in this section match the active filter/search.
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {visibleEntries.map(([fieldKey, fieldDef]) => {
                        const state = fieldStateByKey[fieldKey];
                        const value = state.value;
                        const label = toLabel(fieldKey);
                        const isEmptyValue = state.isEmptyValue;
                        const isRequired = !!fieldDef.required;
                        const isRequiredMissing = isRequired && isEmptyValue;
                        const isFormatInvalid = Boolean(state.validationError);
                        const isInvalid = isRequiredMissing || isFormatInvalid;
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

                            {showDiff && state.isChanged ? (
                              <div className="mt-2 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs">
                                <p className="uppercase tracking-[0.08em] text-zinc-500">
                                  Extracted value
                                </p>
                                <p className="mt-1 text-zinc-300">
                                  {state.originalValue || "Empty"}
                                </p>
                              </div>
                            ) : null}

                            {isEmptyValue ||
                            isRequiredMissing ||
                            isLowConfidence ||
                            isFormatInvalid ? (
                              <p className="mt-2 text-xs text-zinc-500">
                                {fieldDef.description}
                              </p>
                            ) : null}

                            {isRequiredMissing ? (
                              <p className="mt-1 text-xs text-red-400">
                                This field is required.
                              </p>
                            ) : null}

                            {state.validationError ? (
                              <p className="mt-1 text-xs text-red-400">
                                {state.validationError}
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
