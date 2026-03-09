"use client";

import React from "react";
import type { UniversalTicket } from "@/types/universal-ticket";

type Props = {
  ticket: UniversalTicket;
  editable?: boolean;
  onChange?: (ticket: UniversalTicket) => void;
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function hasValue(value: unknown) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function asLines(value?: string[]) {
  return (value ?? []).join("\n");
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function updateField<K extends keyof UniversalTicket>(
  ticket: UniversalTicket,
  key: K,
  value: UniversalTicket[K],
  onChange?: (ticket: UniversalTicket) => void,
) {
  if (!onChange) return;
  onChange({ ...ticket, [key]: value });
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/10 p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function MetaPill({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (!hasValue(value)) return null;

  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80">
      <span className="mr-1 text-white/50">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

function ReadOrEdit({
  label,
  value,
  multiline,
  editable,
  placeholder,
  onChange,
}: {
  label: string;
  value?: string | number;
  multiline?: boolean;
  editable?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
}) {
  if (!editable && !hasValue(value)) return null;

  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-white/45">
        {label}
      </label>

      {editable ? (
        multiline ? (
          <textarea
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="min-h-[112px] w-full resize-y rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
          />
        ) : (
          <input
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
          />
        )
      ) : (
        <div
          className={cx(
            "rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/90",
            multiline && "whitespace-pre-wrap",
          )}
        >
          {String(value)}
        </div>
      )}
    </div>
  );
}

function boardStyles(source: UniversalTicket["source"]) {
  switch (source) {
    case "jira":
      return {
        shell:
          "border-blue-500/20 bg-[#1D2125] text-white shadow-2xl shadow-blue-500/5",
        header: "border-b border-blue-400/15 bg-[#1B1F23]",
        accent: "bg-blue-500",
        badge: "bg-blue-500/15 text-blue-200 border-blue-400/20",
      };
    case "azure":
      return {
        shell:
          "border-sky-500/20 bg-[#20232A] text-white shadow-2xl shadow-sky-500/5",
        header: "border-b border-sky-400/15 bg-[#1A1D24]",
        accent: "bg-sky-500",
        badge: "bg-sky-500/15 text-sky-200 border-sky-400/20",
      };
    case "github":
      return {
        shell:
          "border-emerald-500/20 bg-[#0D1117] text-white shadow-2xl shadow-emerald-500/5",
        header: "border-b border-emerald-400/15 bg-[#161B22]",
        accent: "bg-emerald-500",
        badge: "bg-emerald-500/15 text-emerald-200 border-emerald-400/20",
      };
    default:
      return {
        shell: "border-white/10 bg-[#18181B] text-white",
        header: "border-b border-white/10 bg-[#111114]",
        accent: "bg-white",
        badge: "bg-white/10 text-white border-white/10",
      };
  }
}

export default function TicketTemplatePreview({
  ticket,
  editable = false,
  onChange,
}: Props) {
  const styles = boardStyles(ticket.source);
  const keyOrId = ticket.key ?? ticket.id;
  const labels = ticket.labels ?? [];
  const components = ticket.components ?? [];
  const fixVersions = ticket.fixVersions ?? [];
  const acceptanceCriteria = ticket.acceptanceCriteria ?? [];
  const reproductionSteps = ticket.reproductionSteps ?? [];
  const comments = ticket.comments ?? [];
  const children = ticket.children ?? [];
  const attachments = ticket.attachments ?? [];

  const hasLeftColumn =
    editable ||
    hasValue(ticket.description) ||
    acceptanceCriteria.length > 0 ||
    reproductionSteps.length > 0 ||
    hasValue(ticket.expectedBehavior) ||
    hasValue(ticket.actualBehavior) ||
    comments.length > 0;

  const hasRightColumn =
    editable ||
    hasValue(keyOrId) ||
    hasValue(ticket.assignee) ||
    hasValue(ticket.reporter) ||
    hasValue(ticket.createdBy) ||
    hasValue(ticket.sprint) ||
    hasValue(ticket.milestone) ||
    hasValue(ticket.storyPoints) ||
    hasValue(ticket.dueDate) ||
    hasValue(ticket.parentKey) ||
    hasValue(ticket.parentTitle) ||
    hasValue(ticket.epicKey) ||
    hasValue(ticket.epicTitle) ||
    labels.length > 0 ||
    components.length > 0 ||
    fixVersions.length > 0 ||
    children.length > 0 ||
    attachments.length > 0;

  const gridClass =
    hasLeftColumn && hasRightColumn
      ? "grid gap-5 p-5 lg:grid-cols-[1.45fr_0.9fr]"
      : "grid gap-5 p-5";

  return (
    <div className={cx("overflow-hidden rounded-[28px] border", styles.shell)}>
      <div className={cx("relative p-5", styles.header)}>
        <div className="absolute inset-x-0 top-0 h-1">
          <div className={cx("h-full w-28 rounded-br-full", styles.accent)} />
        </div>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/45">
              <span>{ticket.source}</span>
              {hasValue(keyOrId) && <span>• {keyOrId}</span>}
              {hasValue(ticket.project) && <span>• {ticket.project}</span>}
            </div>

            <ReadOrEdit
              label="Title"
              value={ticket.title}
              editable={editable}
              placeholder="Ticket title"
              onChange={(value) =>
                updateField(ticket, "title", value, onChange)
              }
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {hasValue(ticket.kind) && (
              <div
                className={cx(
                  "rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.14em]",
                  styles.badge,
                )}
              >
                {ticket.kind}
              </div>
            )}
            <MetaPill
              label="Status"
              value={ticket.statusRaw ?? ticket.statusCategory}
            />
            <MetaPill
              label="Priority"
              value={ticket.priorityRaw ?? ticket.priorityNormalized}
            />
          </div>
        </div>
      </div>

      <div className={gridClass}>
        {hasLeftColumn && (
          <div className="space-y-5">
            {(editable || hasValue(ticket.description)) && (
              <Section title="Description">
                <ReadOrEdit
                  label="Description"
                  value={ticket.description}
                  multiline
                  editable={editable}
                  placeholder="Ticket description"
                  onChange={(value) =>
                    updateField(
                      ticket,
                      "description",
                      value || undefined,
                      onChange,
                    )
                  }
                />
              </Section>
            )}

            {(editable || acceptanceCriteria.length > 0) && (
              <Section title="Acceptance criteria">
                <ReadOrEdit
                  label="Acceptance criteria"
                  value={asLines(acceptanceCriteria)}
                  multiline
                  editable={editable}
                  placeholder="One line per criterion"
                  onChange={(value) =>
                    updateField(
                      ticket,
                      "acceptanceCriteria",
                      splitLines(value),
                      onChange,
                    )
                  }
                />
              </Section>
            )}

            {(editable ||
              reproductionSteps.length > 0 ||
              hasValue(ticket.expectedBehavior) ||
              hasValue(ticket.actualBehavior)) && (
              <Section title="Bug details">
                <div className="grid gap-3">
                  <ReadOrEdit
                    label="Reproduction steps"
                    value={asLines(reproductionSteps)}
                    multiline
                    editable={editable}
                    placeholder="One line per step"
                    onChange={(value) =>
                      updateField(
                        ticket,
                        "reproductionSteps",
                        splitLines(value),
                        onChange,
                      )
                    }
                  />
                  <ReadOrEdit
                    label="Expected behavior"
                    value={ticket.expectedBehavior}
                    multiline
                    editable={editable}
                    placeholder="Expected behavior"
                    onChange={(value) =>
                      updateField(
                        ticket,
                        "expectedBehavior",
                        value || undefined,
                        onChange,
                      )
                    }
                  />
                  <ReadOrEdit
                    label="Actual behavior"
                    value={ticket.actualBehavior}
                    multiline
                    editable={editable}
                    placeholder="Actual behavior"
                    onChange={(value) =>
                      updateField(
                        ticket,
                        "actualBehavior",
                        value || undefined,
                        onChange,
                      )
                    }
                  />
                </div>
              </Section>
            )}

            {(editable || comments.length > 0) && (
              <Section title="Comments">
                <ReadOrEdit
                  label="Comments"
                  value={asLines(comments)}
                  multiline
                  editable={editable}
                  placeholder="One line per comment"
                  onChange={(value) =>
                    updateField(ticket, "comments", splitLines(value), onChange)
                  }
                />
              </Section>
            )}
          </div>
        )}

        {hasRightColumn && (
          <div className="space-y-5">
            {(editable ||
              hasValue(keyOrId) ||
              hasValue(ticket.assignee) ||
              hasValue(ticket.reporter) ||
              hasValue(ticket.createdBy) ||
              hasValue(ticket.sprint) ||
              hasValue(ticket.milestone) ||
              hasValue(ticket.storyPoints) ||
              hasValue(ticket.dueDate) ||
              hasValue(ticket.parentKey) ||
              hasValue(ticket.parentTitle) ||
              hasValue(ticket.epicKey) ||
              hasValue(ticket.epicTitle)) && (
              <Section title="Details">
                <div className="grid gap-3">
                  <ReadOrEdit
                    label="Key / ID"
                    value={keyOrId}
                    editable={editable}
                    placeholder="ABC-123"
                    onChange={(value) => {
                      const next = value || undefined;
                      if (!onChange) return;
                      onChange({ ...ticket, key: next, id: next });
                    }}
                  />
                  <ReadOrEdit
                    label="Assignee"
                    value={ticket.assignee}
                    editable={editable}
                    placeholder="Assignee"
                    onChange={(value) =>
                      updateField(
                        ticket,
                        "assignee",
                        value || undefined,
                        onChange,
                      )
                    }
                  />
                  <ReadOrEdit
                    label="Reporter"
                    value={ticket.reporter}
                    editable={editable}
                    placeholder="Reporter"
                    onChange={(value) =>
                      updateField(
                        ticket,
                        "reporter",
                        value || undefined,
                        onChange,
                      )
                    }
                  />
                  <ReadOrEdit
                    label="Created by"
                    value={ticket.createdBy}
                    editable={editable}
                    placeholder="Created by"
                    onChange={(value) =>
                      updateField(
                        ticket,
                        "createdBy",
                        value || undefined,
                        onChange,
                      )
                    }
                  />
                  <ReadOrEdit
                    label="Sprint"
                    value={ticket.sprint}
                    editable={editable}
                    placeholder="Sprint"
                    onChange={(value) =>
                      updateField(
                        ticket,
                        "sprint",
                        value || undefined,
                        onChange,
                      )
                    }
                  />
                  <ReadOrEdit
                    label="Milestone"
                    value={ticket.milestone}
                    editable={editable}
                    placeholder="Milestone"
                    onChange={(value) =>
                      updateField(
                        ticket,
                        "milestone",
                        value || undefined,
                        onChange,
                      )
                    }
                  />
                  <ReadOrEdit
                    label="Story points"
                    value={ticket.storyPoints}
                    editable={editable}
                    placeholder="Story points"
                    onChange={(value) =>
                      updateField(
                        ticket,
                        "storyPoints",
                        value ? Number(value) : undefined,
                        onChange,
                      )
                    }
                  />
                  <ReadOrEdit
                    label="Due date"
                    value={ticket.dueDate}
                    editable={editable}
                    placeholder="YYYY-MM-DD"
                    onChange={(value) =>
                      updateField(
                        ticket,
                        "dueDate",
                        value || undefined,
                        onChange,
                      )
                    }
                  />
                  <ReadOrEdit
                    label="Parent"
                    value={
                      ticket.parentKey && ticket.parentTitle
                        ? `${ticket.parentKey} — ${ticket.parentTitle}`
                        : (ticket.parentKey ?? ticket.parentTitle)
                    }
                    editable={false}
                  />
                  <ReadOrEdit
                    label="Epic"
                    value={
                      ticket.epicKey && ticket.epicTitle
                        ? `${ticket.epicKey} — ${ticket.epicTitle}`
                        : (ticket.epicKey ?? ticket.epicTitle)
                    }
                    editable={false}
                  />
                </div>
              </Section>
            )}

            {(editable ||
              labels.length > 0 ||
              components.length > 0 ||
              fixVersions.length > 0) && (
              <Section title="Classification">
                <ReadOrEdit
                  label="Labels"
                  value={asLines(labels)}
                  multiline
                  editable={editable}
                  placeholder="One label per line"
                  onChange={(value) =>
                    updateField(ticket, "labels", splitLines(value), onChange)
                  }
                />
                <ReadOrEdit
                  label="Components"
                  value={asLines(components)}
                  multiline
                  editable={editable}
                  placeholder="One component per line"
                  onChange={(value) =>
                    updateField(
                      ticket,
                      "components",
                      splitLines(value),
                      onChange,
                    )
                  }
                />
                <ReadOrEdit
                  label="Fix versions"
                  value={asLines(fixVersions)}
                  multiline
                  editable={editable}
                  placeholder="One version per line"
                  onChange={(value) =>
                    updateField(
                      ticket,
                      "fixVersions",
                      splitLines(value),
                      onChange,
                    )
                  }
                />
              </Section>
            )}

            {(editable || children.length > 0) && (
              <Section title="Children">
                {editable ? (
                  <textarea
                    value={children
                      .map(
                        (child) =>
                          `${child.key ?? ""} | ${child.kind ?? ""} | ${child.title}`,
                      )
                      .join("\n")}
                    onChange={(e) => {
                      const nextChildren = e.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line) => {
                          const [key, kind, ...titleParts] = line
                            .split("|")
                            .map((part) => part.trim());

                          return {
                            key: key || undefined,
                            kind: kind || undefined,
                            title: titleParts.join(" | ") || "Untitled child",
                          };
                        });

                      updateField(ticket, "children", nextChildren, onChange);
                    }}
                    rows={5}
                    placeholder="CHILD-1 | task | Implement CTA"
                    className="min-h-[112px] w-full resize-y rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
                  />
                ) : (
                  <div className="space-y-2">
                    {children.map((child, index) => (
                      <div
                        key={`${child.key ?? child.title}-${index}`}
                        className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/90"
                      >
                        <div className="font-medium">{child.title}</div>
                        <div className="mt-1 text-xs text-white/55">
                          {[child.key, child.kind]
                            .filter(Boolean)
                            .join(" • ") || "No child metadata"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}

            {(editable || attachments.length > 0) && (
              <Section title="Attachments">
                {editable ? (
                  <textarea
                    value={attachments
                      .map((item) => `${item.name ?? ""} | ${item.type ?? ""}`)
                      .join("\n")}
                    onChange={(e) => {
                      const nextAttachments = e.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line) => {
                          const [name, type] = line
                            .split("|")
                            .map((part) => part.trim());

                          return {
                            name: name || undefined,
                            type: type || undefined,
                          };
                        });

                      updateField(
                        ticket,
                        "attachments",
                        nextAttachments,
                        onChange,
                      );
                    }}
                    rows={4}
                    placeholder="brief.pdf | application/pdf"
                    className="min-h-[96px] w-full resize-y rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
                  />
                ) : (
                  <div className="space-y-2">
                    {attachments.map((item, index) => (
                      <div
                        key={`${item.name ?? item.type}-${index}`}
                        className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/90"
                      >
                        <div>{item.name || "Unnamed attachment"}</div>
                        {item.type && (
                          <div className="mt-1 text-xs text-white/55">
                            {item.type}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
