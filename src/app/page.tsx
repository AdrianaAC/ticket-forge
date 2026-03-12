"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import ImagePreviewList from "@/components/ImagePreviewList";
import TicketTypeSelector from "@/components/TicketTypeSelector";
import ExtractionReviewForm from "@/components/ExtractionReviewForm";
import FinalTicketPreview from "@/components/FinalTicketPreview";
import AnalysisInsights from "@/components/AnalysisInsights";
import { fileToDataUrl } from "@/lib/fileToDataUrl";
import type {
  TicketAnalysisResult,
  TicketSource,
  UniversalTicket,
} from "@/types/universal-ticket";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [source, setSource] = useState<TicketSource>("jira");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<TicketAnalysisResult | null>(null);
  const [confirmedTicket, setConfirmedTicket] =
    useState<UniversalTicket | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    try {
      setError(null);
      setConfirmedTicket(null);
      setAnalysisResult(null);

      if (!files.length) {
        setError("Please upload at least one screenshot.");
        return;
      }

      setIsAnalyzing(true);

      const images = await Promise.all(files.map(fileToDataUrl));

      const response = await fetch("/api/analyze-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source,
          images,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze ticket.");
      }

      setAnalysisResult(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleConfirmTicket(ticket: UniversalTicket) {
    setConfirmedTicket(ticket);
  }

  function handleStartNewAnalysis() {
    setConfirmedTicket(null);
    setAnalysisResult(null);
    setError(null);
    setFiles([]);
  }

  const currentStep = confirmedTicket ? 3 : analysisResult ? 2 : 1;
  const steps = [
    { id: 1, label: "Upload" },
    { id: 2, label: "Review" },
    { id: 3, label: "Finalize" },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-100 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">TicketForge</h1>
        <p className="mt-3 text-zinc-400">
          Turn ticket screenshots into clear developer briefs.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isDone = step.id < currentStep;

            return (
              <div
                key={step.id}
                className={[
                  "rounded-lg border px-3 py-2 text-center text-xs uppercase tracking-[0.12em] transition",
                  isActive
                    ? "border-blue-500/60 bg-blue-500/15 text-blue-200"
                    : isDone
                      ? "border-emerald-600/60 bg-emerald-500/10 text-emerald-200"
                      : "border-zinc-700 bg-zinc-900 text-zinc-500",
                ].join(" ")}
              >
                {step.label}
              </div>
            );
          })}
        </div>

        <TicketTypeSelector value={source} onChange={setSource} />
        <UploadZone onFilesSelected={setFiles} />
        <ImagePreviewList files={files} />

        <div className="mt-6">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !files.length}
            className="rounded-xl bg-white px-5 py-3 font-medium text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze ticket"}
          </button>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-200">
            {error}
          </div>
        ) : null}

        {analysisResult ? <AnalysisInsights result={analysisResult} /> : null}

        {analysisResult && !confirmedTicket ? (
          <ExtractionReviewForm
            initialTicket={analysisResult.ticket}
            onConfirm={handleConfirmTicket}
          />
        ) : null}

        {confirmedTicket ? (
          <>
            <FinalTicketPreview ticket={confirmedTicket} />

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleStartNewAnalysis}
                className="rounded-xl border border-zinc-600 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-100 transition hover:border-zinc-400 hover:bg-zinc-800"
              >
                Start new analysis
              </button>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
