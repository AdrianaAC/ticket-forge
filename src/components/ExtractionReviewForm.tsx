"use client";

import { useMemo, useState } from "react";
import type { UniversalTicket } from "@/types/universal-ticket";
import JiraSchemaReviewFields from "@/components/tickets/JiraSchemaReviewFields";
import { getJiraRenderFields } from "@/schemas/get-jira-render-fields";
import {
  getMissingRequiredFields,
  hasMissingRequiredFields,
} from "@/lib/tickets/schema-validation";

type Props = {
  initialTicket: UniversalTicket;
  onConfirm: (ticket: UniversalTicket) => void;
};

function toLabel(fieldKey: string) {
  return fieldKey
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ExtractionReviewForm({
  initialTicket,
  onConfirm,
}: Props) {
  const [ticket, setTicket] = useState<UniversalTicket>(initialTicket);
  const [jiraValidationErrors, setJiraValidationErrors] = useState(0);

  const isJiraTicket = ticket.source === "jira";

  const jiraRenderFields = useMemo(() => getJiraRenderFields(), []);

  const missingRequiredFields = useMemo(() => {
    if (!isJiraTicket) return [];
    return getMissingRequiredFields(ticket, jiraRenderFields);
  }, [ticket, isJiraTicket, jiraRenderFields]);

  const isConfirmDisabled = useMemo(() => {
    if (!isJiraTicket) return false;
    return (
      hasMissingRequiredFields(ticket, jiraRenderFields) ||
      jiraValidationErrors > 0
    );
  }, [ticket, isJiraTicket, jiraRenderFields, jiraValidationErrors]);

  return (
    <section className="mt-8">
      <div className="space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div>
          <h2 className="text-2xl font-semibold">Review extracted ticket</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Confirm or edit the extracted fields before creating the final
            ticket.
          </p>

          {isJiraTicket && missingRequiredFields.length > 0 ? (
            <div className="mt-4 rounded-xl border border-red-800/70 bg-red-950/30 p-3">
              <p className="text-sm text-red-300">
                Please fill all required fields before confirming (
                {missingRequiredFields.length} missing).
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {missingRequiredFields.map((field) => (
                  <span
                    key={field}
                    className="rounded-md border border-red-700/80 bg-red-950 px-2 py-1 text-xs text-red-200"
                  >
                    {toLabel(field)}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {isJiraTicket && jiraValidationErrors > 0 ? (
            <div className="mt-3 rounded-xl border border-red-800/70 bg-red-950/20 p-3">
              <p className="text-sm text-red-300">
                Fix {jiraValidationErrors} invalid field
                {jiraValidationErrors === 1 ? "" : "s"} format before
                confirming.
              </p>
            </div>
          ) : null}
        </div>

        {isJiraTicket ? (
          <JiraSchemaReviewFields
            ticket={ticket}
            originalTicket={initialTicket}
            onChange={setTicket}
            onValidationStateChange={(state) =>
              setJiraValidationErrors(state.errorsCount)
            }
          />
        ) : null}

        <div className="sticky bottom-3 z-10 rounded-xl border border-zinc-700 bg-zinc-900/95 p-3 backdrop-blur">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-zinc-300">
              {isConfirmDisabled
                ? jiraValidationErrors > 0
                  ? `${jiraValidationErrors} field format issue${
                      jiraValidationErrors === 1 ? "" : "s"
                    } to fix.`
                  : `${missingRequiredFields.length} required field${
                      missingRequiredFields.length === 1 ? "" : "s"
                    } still missing.`
                : "All required fields are complete."}
            </p>

            <button
              type="button"
              onClick={() => onConfirm(ticket)}
              disabled={isConfirmDisabled}
              className={[
                "rounded-xl px-5 py-3 font-medium transition",
                isConfirmDisabled
                  ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
                  : "bg-white text-zinc-950 hover:opacity-90",
              ].join(" ")}
            >
              Confirm ticket
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
