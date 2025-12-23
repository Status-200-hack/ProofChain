'use client';

import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/25" />
        <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/25" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
        <header className="grid gap-8 rounded-3xl border border-white/10 bg-white/70 px-6 py-10 shadow-[0_22px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)] md:items-center">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-500/10 dark:bg-indigo-500/15 dark:text-indigo-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Proof of existence · Ethereum Sepolia
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
                Proof of existence on Ethereum.
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                Anchor a file&apos;s fingerprint on-chain in seconds. Upload once, mint an immutable
                timestamp on Ethereum, and share a public proof that anyone can verify.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/create"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-50 shadow-lg shadow-slate-900/30 transition hover:translate-y-0.5 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Create Proof
              </Link>
              <Link
                href="/verify"
                className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/60 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 hover:scale-105 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-slate-600"
              >
                Verify Proof
              </Link>
            </div>
          </div>
          <div className="w-full max-w-md justify-self-end">
            <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-5 shadow-md shadow-slate-900/10 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                How it works
              </p>
              <ol className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex gap-2">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-slate-900 text-center text-[11px] font-semibold text-white dark:bg-slate-50 dark:text-slate-900">
                    1
                  </span>
                  <span>Upload your file and pin it to IPFS.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-slate-900 text-center text-[11px] font-semibold text-white dark:bg-slate-50 dark:text-slate-900">
                    2
                  </span>
                  <span>Register the IPFS CID on Ethereum Sepolia.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-slate-900 text-center text-[11px] font-semibold text-white dark:bg-slate-50 dark:text-slate-900">
                    3
                  </span>
                  <span>Share a public link that anyone can verify.</span>
                </li>
              </ol>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                No accounts, no passwords—just your wallet and a permanent on-chain record.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/70 px-6 py-8 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              Why Ethereum?
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Built on blockchain technology for trust, transparency, and permanence.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-500/20">
                <span className="text-lg">🔒</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Immutable timestamps
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Once recorded, timestamps cannot be altered or deleted.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/20">
                <span className="text-lg">🔍</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Public verifiability
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Anyone can verify proofs independently on-chain.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/20">
                <span className="text-lg">🌐</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  No central authority
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Decentralized network eliminates single points of failure.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-500/20">
                <span className="text-lg">👛</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Wallet-based identity
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Your wallet is your identity—no accounts or passwords needed.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
