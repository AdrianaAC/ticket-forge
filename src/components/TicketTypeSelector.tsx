"use client";

import type { TicketSource } from "@/types/ticket";

type TicketTypeSelectorProps = {
  value: TicketSource;
  onChange: (value: TicketSource) => void;
};

const options: { label: string; value: TicketSource }[] = [
  { label: "Jira", value: "jira" },
  { label: "Azure DevOps", value: "azure" },
  { label: "GitHub", value: "github" },
  { label: "Unknown", value: "unknown" },
];

export default function TicketTypeSelector({
  value,
  onChange,
}: TicketTypeSelectorProps) {
  return (
    <div className="mt-6">
      <label
        htmlFor="ticket-source"
        className="mb-2 block text-sm font-medium text-zinc-300"
      >
        Ticket source
      </label>

      <select
        id="ticket-source"
        value={value}
        onChange={(e) => onChange(e.target.value as TicketSource)}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none ring-0"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
