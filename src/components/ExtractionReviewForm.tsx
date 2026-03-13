"use client";

import { useMemo, useState } from "react";
import type { UniversalTicket } from "@/types/universal-ticket";
import SchemaReviewFields from "@/components/tickets/SchemaReviewFields";
import {
  getReviewConfig,
  getReviewRenderFields,
} from "@/schemas/review-schema-config";
import {
  getMissingRequiredFields,
  hasMissingRequiredFields,
} from "@/lib/tickets/schema-validation";

type Props = {
  initialTicket: UniversalTicket;
  onConfirm: (ticket: UniversalTicket) => void;
};

function toLabel(fieldKey: string) {
  return fieldKey
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ExtractionReviewForm({
  initialTicket,
  onConfirm,
}: Props) {
  const [ticket, setTicket] = useState<UniversalTicket>(initialTicket);
  const [validationErrors, setValidationErrors] = useState(0);

  const reviewConfig = useMemo(
    () => getReviewConfig(ticket.source),
    [ticket.source],
  );

  const renderFields = useMemo(() => {
    if (!reviewConfig) return null;
    return getReviewRenderFields(reviewConfig.schema);
  }, [reviewConfig]);

  const missingRequiredFields = useMemo(() => {
    if (!renderFields) return [];
    return getMissingRequiredFields(ticket, renderFields);
  }, [ticket, renderFields]);

  const isConfirmDisabled = useMemo(() => {
    if (!renderFields) return false;
    return hasMissingRequiredFields(ticket, renderFields) || validationErrors > 0;
  }, [ticket, renderFields, validationErrors]);

  return (
    <section className="mt-8">
      <div className="space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div>
          <h2 className="text-2xl font-semibold">Review extracted ticket</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Confirm or edit the extracted fields before creating the final
            ticket.
          </p>

          {renderFields && missingRequiredFields.length > 0 ? (
            <div className="mt-4 rounded-xl border border-red-800/70 bg-red-950/30 p-3">
              <p className="text-sm text-red-300">
                Please fill all required fields before confirming (
                {missingRequiredFields.length} missing).
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {missingRequiredFields.map((field) => (
                  <span
                    key={field}
                    className="rounded-md border border-red-700/80 bg-red-950 px-2 py-1 text-xs text-red-200"
                  >
                    {toLabel(field)}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {renderFields && validationErrors > 0 ? (
            <div className="mt-3 rounded-xl border border-red-800/70 bg-red-950/20 p-3">
              <p className="text-sm text-red-300">
                Fix {validationErrors} invalid field
                {validationErrors === 1 ? "" : "s"} format before
                confirming.
              </p>
            </div>
          ) : null}
        </div>

        {reviewConfig ? (
          <SchemaReviewFields
            label={reviewConfig.label}
            schema={reviewConfig.schema}
            strictPrefilledDropdownFields={
              reviewConfig.strictPrefilledDropdownFields
            }
            ticket={ticket}
            originalTicket={initialTicket}
            onChange={setTicket}
            onValidationStateChange={(state) =>
              setValidationErrors(state.errorsCount)
            }
          />
        ) : null}

        <div className="sticky bottom-3 z-10 rounded-xl border border-zinc-700 bg-zinc-900/95 p-3 backdrop-blur">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-zinc-300">
              {isConfirmDisabled
                ? validationErrors > 0
                  ? `${validationErrors} field format issue${
                      validationErrors === 1 ? "" : "s"
                    } to fix.`
                  : `${missingRequiredFields.length} required field${
                      missingRequiredFields.length === 1 ? "" : "s"
                    } still missing.`
                : "All required fields are complete."}
            </p>

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
      </div>
    </section>
  );
}
