'use client';

import { useAccount } from "wagmi";
import ProofList from "@/components/ProofList";
import ProofChainVisualizer from "@/components/ProofChainVisualizer";

export default function DashboardPage() {
  const { isConnected } = useAccount();

  return (
    <div className="relative min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/25" />
        <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/25" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-500/10 dark:bg-indigo-500/15 dark:text-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Dashboard · My proofs
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Your on-chain proofs.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            View the proofs you&apos;ve created with this wallet. Each entry links to a public
            verification page you can share.
          </p>
        </header>

        {/* Blockchain-inspired visual chain */}
        <ProofChainVisualizer />

        {!isConnected ? (
          <div className="rounded-3xl border border-white/10 bg-white/70 p-6 text-sm shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
            <p className="font-semibold text-slate-900 dark:text-slate-50">
              Connect wallet to view your dashboard.
            </p>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Use the wallet button in the top-right corner to connect. Your proofs are tied to your
              wallet address and will appear here once connected.
            </p>
          </div>
        ) : (
          <div className="transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
            <ProofList refreshKey={0} />
          </div>
        )}
      </div>
    </div>
  );
}


