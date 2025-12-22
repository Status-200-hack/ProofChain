'use client';

import { useRef, useState, useEffect } from "react";

type Props = {
  onUploaded?: (cid: string) => void;
};

export default function FileUpload({ onUploaded }: Props) {
  const [progress, setProgress] = useState(0);
  const [cid, setCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleCopyCID = async () => {
    if (!cid) return;
    
    try {
      await navigator.clipboard.writeText(cid);
      setShowToast(true);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = cid;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShowToast(true);
      } catch (fallbackErr) {
        setError('Failed to copy CID');
      }
      document.body.removeChild(textArea);
    }
  };

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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCID}
                className="group flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 hover:shadow-sm dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                title="Click to copy CID"
              >
                <svg
                  className="h-4 w-4 transition-transform group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-mono">{shorten(cid)}</span>
              </button>
              <a
                href={`https://ipfs.io/ipfs/${cid}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                title="Open in IPFS"
              >
                View
              </a>
            </div>
          ) : null}
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-lg dark:border-emerald-800 dark:bg-emerald-900/90">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                CID copied to clipboard!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function shorten(value: string) {
  if (value.length <= 10) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

