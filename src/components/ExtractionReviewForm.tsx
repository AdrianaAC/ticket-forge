"use client";

import { useEffect, useId, useState } from "react";
import type { NormalizedTicket } from "@/types/ticket";

type Props = {
  initialTicket: NormalizedTicket;
  onConfirm: (ticket: NormalizedTicket) => void;
};

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(items: string[]) {
  return items.join("\n");
}

export default function ExtractionReviewForm({
  initialTicket,
  onConfirm,
}: Props) {
  const [ticket, setTicket] = useState<NormalizedTicket>(initialTicket);
  const fieldIdPrefix = useId();

  useEffect(() => {
    setTicket(initialTicket);
  }, [initialTicket]);

  function fieldId(name: string) {
    return `${fieldIdPrefix}-${name}`;
  }

  return (
    <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-2xl font-semibold">Review extracted ticket</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Confirm or edit the extracted fields before creating the final ticket.
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm(ticket);
        }}
      >
        <div>
          <label
            htmlFor={fieldId("title")}
            className="mb-2 block text-sm font-medium"
          >
            Title
          </label>
          <input
            id={fieldId("title")}
            type="text"
            value={ticket.title}
            onChange={(e) => setTicket({ ...ticket, title: e.target.value })}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor={fieldId("ticket-id")}
              className="mb-2 block text-sm font-medium"
            >
              Ticket ID
            </label>
            <input
              id={fieldId("ticket-id")}
              type="text"
              value={ticket.ticketId ?? ""}
              onChange={(e) =>
                setTicket({
                  ...ticket,
                  ticketId: e.target.value.trim() ? e.target.value : undefined,
                })
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
            />
          </div>

          <div>
            <label
              htmlFor={fieldId("priority")}
              className="mb-2 block text-sm font-medium"
            >
              Priority
            </label>
            <input
              id={fieldId("priority")}
              type="text"
              value={ticket.priority ?? ""}
              onChange={(e) =>
                setTicket({
                  ...ticket,
                  priority: e.target.value.trim() ? e.target.value : undefined,
                })
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor={fieldId("story-points")}
              className="mb-2 block text-sm font-medium"
            >
              Story points
            </label>
            <input
              id={fieldId("story-points")}
              type="number"
              min={0}
              step={1}
              value={ticket.storyPoints ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                const parsedValue = Number(value);

                setTicket({
                  ...ticket,
                  storyPoints:
                    value && Number.isFinite(parsedValue)
                      ? parsedValue
                      : undefined,
                });
              }}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
            />
          </div>

          <div>
            <label
              htmlFor={fieldId("assignee")}
              className="mb-2 block text-sm font-medium"
            >
              Assignee
            </label>
            <input
              id={fieldId("assignee")}
              type="text"
              value={ticket.assignee ?? ""}
              onChange={(e) =>
                setTicket({
                  ...ticket,
                  assignee: e.target.value.trim() ? e.target.value : undefined,
                })
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={fieldId("description")}
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>
          <textarea
            id={fieldId("description")}
            value={ticket.description ?? ""}
            onChange={(e) =>
              setTicket({
                ...ticket,
                description: e.target.value.trim() ? e.target.value : undefined,
              })
            }
            rows={6}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor={fieldId("acceptance-criteria")}
            className="mb-2 block text-sm font-medium"
          >
            Acceptance criteria (one per line)
          </label>
          <textarea
            id={fieldId("acceptance-criteria")}
            value={joinLines(ticket.acceptanceCriteria)}
            onChange={(e) =>
              setTicket({
                ...ticket,
                acceptanceCriteria: splitLines(e.target.value),
              })
            }
            rows={5}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor={fieldId("labels")}
            className="mb-2 block text-sm font-medium"
          >
            Labels (one per line)
          </label>
          <textarea
            id={fieldId("labels")}
            value={joinLines(ticket.labels)}
            onChange={(e) =>
              setTicket({
                ...ticket,
                labels: splitLines(e.target.value),
              })
            }
            rows={4}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor={fieldId("comments")}
            className="mb-2 block text-sm font-medium"
          >
            Comments (one per line)
          </label>
          <textarea
            id={fieldId("comments")}
            value={joinLines(ticket.comments)}
            onChange={(e) =>
              setTicket({
                ...ticket,
                comments: splitLines(e.target.value),
              })
            }
            rows={5}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-white px-5 py-3 font-medium text-zinc-950 transition hover:opacity-90"
        >
          Confirm ticket
        </button>
      </form>
    </section>
  );
}
