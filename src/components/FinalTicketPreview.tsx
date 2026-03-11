"use client";

import type { UniversalTicket } from "@/types/universal-ticket";

type Props = {
  ticket: UniversalTicket;
};

function hasText(value?: string) {
  return Boolean(value && value.trim().length > 0);
}

function meaningful(value?: string) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.toLowerCase() === "unknown") return undefined;
  return trimmed;
}

function toList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toStringValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return undefined;
}

function pillClass(source: UniversalTicket["source"]) {
  switch (source) {
    case "jira":
      return "border-blue-500/30 bg-blue-500/10 text-blue-200";
    case "azure":
      return "border-sky-500/30 bg-sky-500/10 text-sky-200";
    case "github":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    default:
      return "border-zinc-600 bg-zinc-800 text-zinc-200";
  }
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
        {title}
      </h3>
      {children}
    </section>
  );
}

function KeyValue({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (value === undefined || value === null || String(value).trim().length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-100">{value}</span>
    </div>
  );
}

function ChipList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-zinc-500">None</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-200"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function FinalTicketPreview({ ticket }: Props) {
  const keyOrId = meaningful(ticket.key ?? ticket.id);
  const status = meaningful(ticket.statusRaw ?? ticket.statusCategory);
  const priority = meaningful(ticket.priorityRaw ?? ticket.priorityNormalized);
  const kind = meaningful(ticket.kind);
  const labels = ticket.labels ?? [];
  const components = ticket.components ?? [];
  const fixVersions = ticket.fixVersions ?? [];
  const acceptanceCriteria = ticket.acceptanceCriteria ?? [];
  const children = ticket.children ?? [];
  const comments = toList(ticket.comments);
  const createdAt = toStringValue(ticket.customFields?.created_at);
  const updatedAt = toStringValue(ticket.customFields?.updated_at);
  const parentText =
    ticket.parentKey && ticket.parentTitle
      ? `${ticket.parentKey} - ${ticket.parentTitle}`
      : ticket.parentKey ?? ticket.parentTitle;
  const epicText =
    ticket.epicKey && ticket.epicTitle
      ? `${ticket.epicKey} - ${ticket.epicTitle}`
      : ticket.epicKey ?? ticket.epicTitle;

  return (
    <section className="mt-8 space-y-4">
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={[
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em]",
                  pillClass(ticket.source),
                ].join(" ")}
              >
                {ticket.source}
              </span>
              {hasText(keyOrId) ? (
                <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300">
                  {keyOrId}
                </span>
              ) : null}
            </div>
            <h2 className="text-2xl font-semibold text-zinc-50">{ticket.title}</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {kind ? (
              <span className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs uppercase tracking-[0.08em] text-zinc-300">
                {kind}
              </span>
            ) : null}
            {hasText(status) ? (
              <span className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300">
                Status: {status}
              </span>
            ) : null}
            {hasText(priority) ? (
              <span className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300">
                Priority: {priority}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="space-y-4">
          <Section title="Description">
            {hasText(ticket.description) ? (
              <p className="whitespace-pre-wrap text-sm text-zinc-100">
                {ticket.description}
              </p>
            ) : (
              <p className="text-sm text-zinc-500">No description provided.</p>
            )}
          </Section>

          <Section title="Acceptance Criteria">
            {acceptanceCriteria.length > 0 ? (
              <ul className="space-y-2 text-sm text-zinc-100">
                {acceptanceCriteria.map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-lg bg-zinc-950 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500">No acceptance criteria captured.</p>
            )}
          </Section>

          {children.length > 0 ? (
            <Section title="Child Issues">
              <ul className="space-y-2 text-sm text-zinc-100">
                {children.map((child, index) => (
                  <li
                    key={`${child.key ?? child.title}-${index}`}
                    className="rounded-lg bg-zinc-950 px-3 py-2"
                  >
                    <div className="font-medium">{child.title}</div>
                    {hasText(child.key) || hasText(child.kind) ? (
                      <div className="mt-1 text-xs text-zinc-400">
                        {[child.key, child.kind].filter(Boolean).join(" | ")}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </div>

        <div className="space-y-4">
          <Section title="Details">
            <div className="space-y-2">
              <KeyValue label="Project" value={ticket.project} />
              <KeyValue label="Assignee" value={ticket.assignee} />
              <KeyValue label="Reporter" value={ticket.reporter} />
              <KeyValue label="Sprint" value={ticket.sprint} />
              <KeyValue label="Story points" value={ticket.storyPoints} />
              <KeyValue label="Due date" value={ticket.dueDate} />
              <KeyValue label="Parent" value={parentText} />
              <KeyValue label="Epic" value={epicText} />
            </div>
          </Section>

          <Section title="Tags">
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.12em] text-zinc-500">
                  Labels
                </p>
                <ChipList items={labels} />
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.12em] text-zinc-500">
                  Components
                </p>
                <ChipList items={components} />
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.12em] text-zinc-500">
                  Fix versions
                </p>
                <ChipList items={fixVersions} />
              </div>
            </div>
          </Section>

          {hasText(createdAt) || hasText(updatedAt) ? (
            <Section title="Timeline">
              <div className="space-y-2">
                <KeyValue label="Created" value={createdAt} />
                <KeyValue label="Updated" value={updatedAt} />
              </div>
            </Section>
          ) : null}
        </div>
      </div>

      {comments.length > 0 ? (
        <Section title="Comments">
          <ul className="space-y-2 text-sm text-zinc-100">
            {comments.map((comment, index) => (
              <li key={`${comment}-${index}`} className="rounded-lg bg-zinc-950 px-3 py-2">
                {comment}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </section>
  );
}
