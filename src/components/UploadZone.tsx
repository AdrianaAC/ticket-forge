"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type UploadZoneProps = {
  onFilesSelected: (files: File[]) => void;
};

export default function UploadZone({ onFilesSelected }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
    },
    multiple: true,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className="mt-8 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-10 text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      <p className="text-lg font-medium">
        {isDragActive
          ? "Drop the screenshots here"
          : "Drag screenshots here or click to upload"}
      </p>
      <p className="mt-2 text-sm text-zinc-400">
        PNG, JPG or WEBP — Jira, Azure, GitHub issues
      </p>
    </div>
  );
}
