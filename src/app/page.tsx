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

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">TicketForge</h1>
        <p className="mt-3 text-zinc-400">
          Turn ticket screenshots into clear developer briefs.
        </p>

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
          <FinalTicketPreview ticket={confirmedTicket} />
        ) : null}
      </div>
    </main>
  );
}
