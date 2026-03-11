import type { TicketAnalysisResult } from "@/types/universal-ticket";

type Props = {
  result: TicketAnalysisResult;
};

type EmptyFieldHint = {
  label: string;
  reason: string;
};

function getEmptyFieldHints(result: TicketAnalysisResult): EmptyFieldHint[] {
  const ticket = result.ticket;
  const hints: EmptyFieldHint[] = [];

  if (!ticket.dueDate?.trim()) {
    hints.push({
      label: "Due date",
      reason: "Helps the team plan delivery timelines and avoid unexpected delays.",
    });
  }

  if (ticket.storyPoints === undefined) {
    hints.push({
      label: "Story points",
      reason: "Supports sprint capacity planning and estimation quality.",
    });
  }

  if (ticket.originalEstimateHours === undefined) {
    hints.push({
      label: "Original estimate",
      reason: "Improves planned-vs-actual effort tracking.",
    });
  }

  if (!ticket.sprint?.trim()) {
    hints.push({
      label: "Sprint",
      reason: "Links the ticket to a delivery cycle and commitment window.",
    });
  }

  if (ticket.acceptanceCriteria.length === 0) {
    hints.push({
      label: "Acceptance criteria",
      reason: "Clarifies what must be true for the work to be considered done.",
    });
  }

  if (
    (ticket.kind === "bug" || ticket.kind === "issue") &&
    ticket.reproductionSteps.length === 0
  ) {
    hints.push({
      label: "Reproduction steps",
      reason: "Makes bug validation and debugging faster for engineers.",
    });
  }

  return hints;
}

export default function AnalysisInsights({ result }: Props) {
  const emptyFieldHints = getEmptyFieldHints(result);

  return (
    <section className="mt-8 space-y-4">
      {result.missingCriticalFields.length > 0 ? (
        <div className="rounded-xl border border-amber-700 bg-amber-950/30 p-4 text-amber-200">
          <h3 className="font-semibold">Missing critical fields</h3>
          <p className="mt-2 text-sm">
            {result.missingCriticalFields.join(", ")}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-700 bg-emerald-950/30 p-4 text-emerald-200">
          <h3 className="font-semibold">Critical fields look good</h3>
          <p className="mt-2 text-sm">
            The analyzer found the main ticket fields needed for review.
          </p>
        </div>
      )}

      {result.lowConfidenceFields.length > 0 ? (
        <div className="rounded-xl border border-yellow-700 bg-yellow-950/30 p-4 text-yellow-200">
          <h3 className="font-semibold">Low confidence fields</h3>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {result.lowConfidenceFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.extractionWarnings.length > 0 ? (
        <div className="rounded-xl border border-red-700 bg-red-950/30 p-4 text-red-200">
          <h3 className="font-semibold">Extraction warnings</h3>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {result.extractionWarnings.map((warning, index) => (
              <li key={`${warning}-${index}`}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.notes.length > 0 ? (
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-zinc-200">
          <h3 className="font-semibold">Analyzer notes</h3>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {result.notes.map((note, index) => (
              <li key={`${note}-${index}`}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {emptyFieldHints.length > 0 ? (
        <div className="rounded-xl border border-amber-700 bg-amber-950/30 p-4 text-amber-200">
          <h3 className="font-semibold">Empty fields</h3>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {emptyFieldHints.map((hint) => (
              <li key={hint.label}>
                <span className="font-medium">{hint.label}:</span> {hint.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
