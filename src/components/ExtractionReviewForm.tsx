"use client";

import { useEffect, useMemo, useState } from "react";
import type { UniversalTicket } from "@/types/universal-ticket";
import TicketTemplatePreview from "@/components/tickets/TicketTemplatePreview";
import JiraSchemaReviewFields from "@/components/tickets/JiraSchemaReviewFields";
import { jiraTicketSchema } from "@/schemas/jira-ticket-schema";
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

  const missingRequiredFields = useMemo(() => {
    if (!isJiraTicket) return [];
    return getMissingRequiredFields(ticket, jiraTicketSchema);
  }, [ticket, isJiraTicket]);

  const isConfirmDisabled = useMemo(() => {
    if (!isJiraTicket) return false;
    return hasMissingRequiredFields(ticket, jiraTicketSchema);
  }, [ticket, isJiraTicket]);

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

        <TicketTemplatePreview ticket={ticket} editable onChange={setTicket} />

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
