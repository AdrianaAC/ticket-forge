"use client";

import TicketTemplatePreview from "@/components/tickets/TicketTemplatePreview";
import type { NormalizedTicket } from "@/types/ticket";
import type { UniversalTicket } from "@/types/universal-ticket";

type Props = {
  ticket: NormalizedTicket;
};

function toUniversalTicket(ticket: NormalizedTicket): UniversalTicket {
  return {
    source: ticket.source ?? "unknown",
    id: ticket.ticketId || undefined,
    key: ticket.ticketId || undefined,
    project: undefined,
    url: undefined,
    kind: (ticket.kind as UniversalTicket["kind"]) ?? "unknown",
    title: ticket.title || "Untitled ticket",
    description: ticket.description || undefined,
    statusRaw: ticket.status || undefined,
    statusCategory: "unknown",
    priorityRaw: ticket.priority || undefined,
    priorityNormalized: undefined,
    assignee: ticket.assignee || undefined,
    reporter: undefined,
    createdBy: undefined,
    sprint: undefined,
    milestone: undefined,
    storyPoints:
      typeof ticket.storyPoints === "number" ? ticket.storyPoints : undefined,
    originalEstimateHours: undefined,
    remainingWorkHours: undefined,
    completedWorkHours: undefined,
    dueDate: undefined,
    parentKey: undefined,
    parentTitle: undefined,
    epicKey: undefined,
    epicTitle: undefined,
    children: [],
    labels: ticket.labels ?? [],
    components: [],
    areaPath: undefined,
    iterationPath: undefined,
    fixVersions: [],
    acceptanceCriteria: ticket.acceptanceCriteria ?? [],
    reproductionSteps: [],
    expectedBehavior: undefined,
    actualBehavior: undefined,
    environment: undefined,
    comments: ticket.comments ?? [],
    attachments: [],
    extractedFromScreenshots: true,
    sourceScreenshotsCount: undefined,
    rawExtractedText: undefined,
    missingCriticalFields: [],
    customFields: {},
  };
}

export default function FinalTicketPreview({ ticket }: Props) {
  const universalTicket = toUniversalTicket(ticket);

  return (
    <section className="mt-8">
      <TicketTemplatePreview ticket={universalTicket} />
    </section>
  );
}
