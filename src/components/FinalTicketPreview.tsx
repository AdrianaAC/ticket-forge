import type { NormalizedTicket } from "@/types/ticket";

type Props = {
  ticket: NormalizedTicket;
};

export default function FinalTicketPreview({ ticket }: Props) {
  return (
    <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            {ticket.source}
          </p>
          <h2 className="mt-1 text-2xl font-semibold">{ticket.title || "Untitled ticket"}</h2>
          {ticket.ticketId ? (
            <p className="mt-1 text-sm text-zinc-400">{ticket.ticketId}</p>
          ) : null}
        </div>

        <div className="space-y-1 text-sm text-zinc-300">
          {ticket.priority ? <p><span className="text-zinc-500">Priority:</span> {ticket.priority}</p> : null}
          {typeof ticket.storyPoints === "number" ? (
            <p><span className="text-zinc-500">Story points:</span> {ticket.storyPoints}</p>
          ) : null}
          {ticket.assignee ? <p><span className="text-zinc-500">Assignee:</span> {ticket.assignee}</p> : null}
        </div>
      </div>

      {ticket.description ? (
        <div className="mt-6">
          <h3 className="text-lg font-medium">Description</h3>
          <p className="mt-2 whitespace-pre-wrap text-zinc-300">{ticket.description}</p>
        </div>
      ) : null}

      {!!ticket.acceptanceCriteria.length && (
        <div className="mt-6">
          <h3 className="text-lg font-medium">Acceptance Criteria</h3>
          <ul className="mt-2 list-disc space-y-2 pl-6 text-zinc-300">
            {ticket.acceptanceCriteria.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {!!ticket.labels.length && (
        <div className="mt-6">
          <h3 className="text-lg font-medium">Labels</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {ticket.labels.map((label, index) => (
              <span
                key={`${label}-${index}`}
                className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-300"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {!!ticket.comments.length && (
        <div className="mt-6">
          <h3 className="text-lg font-medium">Comments</h3>
          <div className="mt-3 space-y-3">
            {ticket.comments.map((comment, index) => (
              <div
                key={`${comment}-${index}`}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-300"
              >
                {comment}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}