import { nullToUndefined } from "./null-to-undefined";
import { UniversalTicketSchema } from "@/schemas/universal-ticket";

export function normalizeTicketNulls(
  ticket: UniversalTicketSchema,
): UniversalTicketSchema {
  ticket.id = nullToUndefined(ticket.id);
  ticket.key = nullToUndefined(ticket.key);
  ticket.project = nullToUndefined(ticket.project);
  ticket.url = nullToUndefined(ticket.url);
  ticket.description = nullToUndefined(ticket.description);

  ticket.statusRaw = nullToUndefined(ticket.statusRaw);
  ticket.priorityRaw = nullToUndefined(ticket.priorityRaw);
  ticket.priorityNormalized = nullToUndefined(ticket.priorityNormalized);

  ticket.assignee = nullToUndefined(ticket.assignee);
  ticket.reporter = nullToUndefined(ticket.reporter);
  ticket.createdBy = nullToUndefined(ticket.createdBy);

  ticket.sprint = nullToUndefined(ticket.sprint);
  ticket.milestone = nullToUndefined(ticket.milestone);

  ticket.storyPoints = nullToUndefined(ticket.storyPoints);
  ticket.originalEstimateHours = nullToUndefined(ticket.originalEstimateHours);
  ticket.remainingWorkHours = nullToUndefined(ticket.remainingWorkHours);
  ticket.completedWorkHours = nullToUndefined(ticket.completedWorkHours);

  ticket.dueDate = nullToUndefined(ticket.dueDate);

  ticket.parentKey = nullToUndefined(ticket.parentKey);
  ticket.parentTitle = nullToUndefined(ticket.parentTitle);
  ticket.epicKey = nullToUndefined(ticket.epicKey);
  ticket.epicTitle = nullToUndefined(ticket.epicTitle);

  ticket.areaPath = nullToUndefined(ticket.areaPath);
  ticket.iterationPath = nullToUndefined(ticket.iterationPath);

  ticket.expectedBehavior = nullToUndefined(ticket.expectedBehavior);
  ticket.actualBehavior = nullToUndefined(ticket.actualBehavior);
  ticket.environment = nullToUndefined(ticket.environment);

  ticket.rawExtractedText = nullToUndefined(ticket.rawExtractedText);
  ticket.sourceScreenshotsCount = nullToUndefined(
    ticket.sourceScreenshotsCount,
  );

  ticket.children = ticket.children.map((child) => ({
    ...child,
    key: nullToUndefined(child.key),
    kind: nullToUndefined(child.kind),
  }));

  ticket.attachments = ticket.attachments.map((att) => ({
    ...att,
    name: nullToUndefined(att.name),
    type: nullToUndefined(att.type),
  }));

  return ticket;
}
