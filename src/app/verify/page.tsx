'use client';

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VerifyProofPage() {
  const [proofId, setProofId] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = proofId.trim();
    if (!trimmed) return;
    router.push(`/verify/${trimmed}`);
  };

  return (
    <div className="relative min-h-screen px-4 py-12 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/25" />
        <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/25" />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-500/10 dark:bg-indigo-500/15 dark:text-indigo-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Verify on-chain proof
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Verify a Proof
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Enter a proof ID to open its public verification page. No wallet required.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/60 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-slate-600"
          >
            ← Back to Home
          </Link>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="proofId"
                className="mb-2 block text-sm font-semibold text-zinc-800 dark:text-zinc-100"
              >
                Proof ID
              </label>
              <input
                id="proofId"
                type="text"
                value={proofId}
                onChange={(e) => setProofId(e.target.value)}
                placeholder="Enter proof ID (e.g., 0, 1, 2...)"
                className="w-full rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
                required
              />
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                You&apos;ll be redirected to a public page showing proof details and a shareable link.
              </p>
            </div>
            <button
              type="submit"
              disabled={!proofId.trim()}
              className="w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Verify Proof
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

