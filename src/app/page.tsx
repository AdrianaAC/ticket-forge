"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import ImagePreviewList from "@/components/ImagePreviewList";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">TicketForge</h1>
        <p className="mt-3 text-zinc-400">
          Turn ticket screenshots into clear developer briefs.
        </p>

        <UploadZone onFilesSelected={setFiles} />
        <ImagePreviewList files={files} />
      </div>
    </main>
  );
}
