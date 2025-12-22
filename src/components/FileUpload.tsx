'use client';

import { useRef, useState } from "react";

type Props = {
  onUploaded?: (cid: string) => void;
};

export default function FileUpload({ onUploaded }: Props) {
  const [progress, setProgress] = useState(0);
  const [cid, setCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    setError(null);
    setCid(null);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Pick a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/pinata");
    xhr.responseType = "json";

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      setProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setError("Network error during upload.");
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        const res = xhr.response as { cid?: string; error?: string };
        if (res?.cid) {
          setCid(res.cid);
          onUploaded?.(res.cid);
        } else {
          setError(res?.error || "Upload failed.");
        }
      } else {
        const res = xhr.response as { error?: string; details?: string };
        setError(res?.error || "Upload failed.");
      }
    };

    setIsUploading(true);
    xhr.send(formData);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
      <div className="mb-4 space-y-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Upload to IPFS (Pinata)
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Any file (PDF, image, etc). Keys stay server-side on the backend.
        </p>
      </div>
      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:shadow-sm transition hover:file:-translate-y-0.5 hover:file:bg-slate-800 dark:text-slate-200 dark:file:bg-slate-50 dark:file:text-slate-900 dark:hover:file:bg-slate-200"
          accept="*/*"
        />
        {progress > 0 && (
          <div className="h-2 w-full rounded-full bg-slate-200/80 dark:bg-slate-800">
            <div
              className="h-2 rounded-full bg-indigo-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isUploading}
            onClick={handleUpload}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/25 transition hover:translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
          {cid ? (
            <a
              href={`https://ipfs.io/ipfs/${cid}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              CID: {shorten(cid)}
            </a>
          ) : null}
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>
    </div>
  );
}

function shorten(value: string) {
  if (value.length <= 10) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

