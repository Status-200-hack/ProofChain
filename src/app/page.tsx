'use client';

import ProofForm from "@/components/ProofForm";
import ProofList from "@/components/ProofList";
import WalletStatus from "@/components/WalletStatus";
import FileUpload from "@/components/FileUpload";
import { useState } from "react";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="relative min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/25" />
        <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/25" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
        <header className="grid gap-8 rounded-3xl border border-white/10 bg-white/70 px-6 py-8 shadow-[0_22px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)] md:items-center">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-500/10 dark:bg-indigo-500/15 dark:text-indigo-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live on Sepolia · Ethereum
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
                Proof-of-existence for modern Web3 workflows.
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                Upload a document, pin it to IPFS, and anchor its CID on Ethereum. ProofChain
                gives you verifiable, timestamped proofs you can share with anyone.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="/proofs/new"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-50 shadow-lg shadow-slate-900/30 transition hover:translate-y-0.5 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Create your first proof
              </a>
              <a
                href="/verify/0"
                className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/60 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-slate-600"
              >
                Verify a proof
              </a>
            </div>
          </div>
          <div className="w-full max-w-md justify-self-end">
            <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-md shadow-slate-900/10 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
              <WalletStatus />
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Connect MetaMask or another wallet to start anchoring proofs on Sepolia.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
          <div className="transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
            <FileUpload />
          </div>
          <div className="space-y-6">
            <div className="transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
              <ProofForm onSubmitted={() => setRefreshKey((v) => v + 1)} />
            </div>
            <div className="transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
              <ProofList refreshKey={refreshKey} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
