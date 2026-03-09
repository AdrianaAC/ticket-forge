"use client";

import { useEffect, useState } from "react";
import type { UniversalTicket } from "@/types/universal-ticket";
import TicketTemplatePreview from "@/components/tickets/TicketTemplatePreview";

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

  return (
    <section className="mt-8 space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-2xl font-semibold">Review extracted ticket</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Confirm or edit the extracted fields before creating the final ticket.
        </p>
      </div>

      <TicketTemplatePreview ticket={ticket} editable onChange={setTicket} />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onConfirm(ticket)}
          className="rounded-xl bg-white px-5 py-3 font-medium text-zinc-950 transition hover:opacity-90"
        >
          Confirm ticket
        </button>
      </div>
    </section>
  );
}
