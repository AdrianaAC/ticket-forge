import type { UniversalTicket } from "@/types/universal-ticket";

export function buildFallbackNotes(ticket: UniversalTicket): string[] {
  const notes: string[] = [];

  const description = ticket.description?.toLowerCase() ?? "";

  if (
    ticket.acceptanceCriteria.length === 0 &&
    (description.includes("acceptance criteria") ||
      description.includes("criteria") ||
      description.includes("should"))
  ) {
    notes.push("Acceptance criteria may be embedded in the description.");
  }

  if (ticket.storyPoints === undefined) {
    notes.push("Story points are not visible in the screenshots.");
  }

  if (!ticket.assignee?.trim()) {
    notes.push("Assignee is not clearly visible.");
  }

  if (!ticket.parentKey && !ticket.epicKey) {
    notes.push("Hierarchy information is not visible.");
  }

  if (ticket.comments.length === 0) {
    notes.push("Comments are not visible or not present in the screenshots.");
  }

  return notes;
}