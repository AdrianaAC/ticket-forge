"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";

type Props = {
  files: File[];
};

export default function ImagePreviewList({ files }: Props) {
  const previews = useMemo(
    () =>
      files.map((file) => ({
        key: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    [files],
  );

  useEffect(
    () => () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    },
    [previews],
  );

  if (!previews.length) return null;

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {previews.map((file) => (
        <div
          key={file.key}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3"
        >
          <Image
            src={file.url}
            alt={file.name}
            width={640}
            height={384}
            unoptimized
            className="h-48 w-full rounded-xl object-cover"
          />
          <p className="mt-2 truncate text-sm text-zinc-300">{file.name}</p>
        </div>
      ))}
    </div>
  );
}
