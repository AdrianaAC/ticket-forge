"use client";

type ImagePreviewListProps = {
  files: File[];
};

export default function ImagePreviewList({ files }: ImagePreviewListProps) {
  if (!files.length) return null;

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {files.map((file) => {
        const url = URL.createObjectURL(file);

        return (
          <div
            key={`${file.name}-${file.size}`}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3"
          >
            <img
              src={url}
              alt={file.name}
              className="h-48 w-full rounded-xl object-cover"
            />
            <p className="mt-2 truncate text-sm text-zinc-300">{file.name}</p>
          </div>
        );
      })}
    </div>
  );
}
