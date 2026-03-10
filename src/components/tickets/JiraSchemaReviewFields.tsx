"use client";

import { useMemo, useState } from "react";
import { jiraTicketSchema } from "@/schemas/jira-ticket-schema";
import type { UniversalTicket } from "@/types/universal-ticket";
import {
  getTicketFieldValue,
  setTicketFieldValue,
} from "@/lib/tickets/ticket-field-helpers";
import EditableDropdown from "@/components/EditableDropdown";

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

export default function JiraSchemaReviewFields({ ticket, onChange }: Props) {
  const entries = Object.entries(jiraTicketSchema.fields);

  const [customOptions, setCustomOptions] = useState<Record<string, string[]>>(
    {},
  );

  const mergedOptions = useMemo(() => {
    const result: Record<string, string[]> = {};

    for (const [fieldKey, fieldDef] of entries) {
      const baseOptions =
        "allowed_values" in fieldDef && Array.isArray(fieldDef.allowed_values)
          ? [...fieldDef.allowed_values]
          : [];

      const extraOptions = customOptions[fieldKey] ?? [];

      result[fieldKey] = Array.from(new Set([...baseOptions, ...extraOptions]));
    }

    return result;
  }, [entries, customOptions]);

  const addCustomOption = (fieldKey: string, newValue: string) => {
    const trimmed = newValue.trim();
    if (!trimmed) return;

    const fieldDef =
      jiraTicketSchema.fields[fieldKey as keyof typeof jiraTicketSchema.fields];

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

      <div className="grid gap-4 md:grid-cols-2">
        {entries.map(([fieldKey, fieldDef]) => {
          const value = getTicketFieldValue(ticket, fieldKey);
          const label = toLabel(fieldKey);
          const isRequired = !!fieldDef.required;
          const isInvalid = isRequired && isEmpty(value);

          const baseClasses =
            "w-full rounded-xl border bg-zinc-950 px-4 py-3 text-sm text-white focus:outline-none";
          const validClasses =
            "border-zinc-700 placeholder:text-zinc-500 focus:border-zinc-500";
          const invalidClasses =
            "border-red-500 text-red-100 placeholder:text-transparent focus:border-red-400";

          const commonClasses = `${baseClasses} ${
            isInvalid ? invalidClasses : validClasses
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
              </label>

              {fieldDef.input_type === "dropdown" &&
              "allow_custom_values" in fieldDef &&
              fieldDef.allow_custom_values ? (
                <EditableDropdown
                  value={value}
                  options={mergedOptions[fieldKey] ?? []}
                  placeholder="Choose an option"
                  invalid={isInvalid}
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
                  placeholder={isInvalid ? "" : fieldDef.description}
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
                  placeholder={isInvalid ? "" : fieldDef.description}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
