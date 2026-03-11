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

type Props = {
  ticket: UniversalTicket;
  onChange: (ticket: UniversalTicket) => void;
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

  const [customOptions, setCustomOptions] = useState<Record<string, string[]>>(
    {},
  );

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

  const lowConfidenceCount = useMemo(() => {
    return fieldEntries.reduce((count, [fieldKey]) => {
      const confidence = getTicketFieldConfidence(ticket, fieldKey);
      if (
        typeof confidence === "number" &&
        confidence < LOW_CONFIDENCE_THRESHOLD
      ) {
        return count + 1;
      }
      return count;
    }, 0);
  }, [fieldEntries, ticket]);

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

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-white">Jira fields</h3>

      {lowConfidenceCount > 0 ? (
        <div className="rounded-xl border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
          {lowConfidenceCount} field
          {lowConfidenceCount === 1 ? "" : "s"} extracted with low confidence.
          Please verify highlighted values.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {fieldEntries.map(([fieldKey, fieldDef]) => {
          const value = getTicketFieldValue(ticket, fieldKey);
          const label = toLabel(fieldKey);
          const isEmptyValue = isEmpty(value);
          const isRequired = !!fieldDef.required;
          const isInvalid = isRequired && isEmptyValue;
          const confidence = getTicketFieldConfidence(ticket, fieldKey);
          const isLowConfidence =
            !isInvalid &&
            typeof confidence === "number" &&
            confidence < LOW_CONFIDENCE_THRESHOLD;
          const isEmptyField = isEmptyValue && !isInvalid;

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
                fieldDef.input_type === "rich_text" ? "md:col-span-2" : ""
              }
            >
              <label className="mb-2 block text-sm font-medium text-zinc-200">
                {label}
                {isRequired ? (
                  <span className="ml-1 text-red-400">*</span>
                ) : null}
                {isLowConfidence && typeof confidence === "number" ? (
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
                    onChange(setTicketFieldValue(ticket, fieldKey, newValue))
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
                      setTicketFieldValue(ticket, fieldKey, e.target.value),
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
                      setTicketFieldValue(ticket, fieldKey, e.target.value),
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
                      setTicketFieldValue(ticket, fieldKey, e.target.value),
                    )
                  }
                  className={commonClasses}
                />
              )}

              <p className="mt-2 text-xs text-zinc-500">
                {fieldDef.description}
              </p>

              {isInvalid ? (
                <p className="mt-1 text-xs text-red-400">
                  This field is required.
                </p>
              ) : null}

              {isLowConfidence && typeof confidence === "number" ? (
                <p className="mt-1 text-xs text-amber-400">
                  Low confidence extraction ({formatConfidence(confidence)}).
                  Please verify this value.
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
