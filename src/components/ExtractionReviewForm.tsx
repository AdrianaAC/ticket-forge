"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function ExtractionReviewForm({
  initialTicket,
  onConfirm,
}: Props) {
  const [ticket, setTicket] = useState<UniversalTicket>(initialTicket);

  useEffect(() => {
    setTicket(initialTicket);
  }, [initialTicket]);

  const isJiraTicket = ticket.source === "jira";

  const jiraRenderFields = useMemo(() => getJiraRenderFields(), []);

  const missingRequiredFields = useMemo(() => {
    if (!isJiraTicket) return [];
    return getMissingRequiredFields(ticket, jiraRenderFields);
  }, [ticket, isJiraTicket, jiraRenderFields]);

  const isConfirmDisabled = useMemo(() => {
    if (!isJiraTicket) return false;
    return hasMissingRequiredFields(ticket, jiraRenderFields);
  }, [ticket, isJiraTicket, jiraRenderFields]);

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
            <p className="mt-3 text-sm text-red-400">
              Please fill all required fields before confirming.
            </p>
          ) : null}
        </div>

        {isJiraTicket ? (
          <JiraSchemaReviewFields ticket={ticket} onChange={setTicket} />
        ) : null}

        <div className="flex justify-end">
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
    </section>
  );
}
