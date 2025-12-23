'use client';

export default function AboutPage() {
  return (
    <div className="relative min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/25" />
        <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/25" />
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col gap-8">
        <header className="space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-500/10 dark:bg-indigo-500/15 dark:text-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            About ProofChain
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Proof-of-existence for real-world documents.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            ProofChain lets you anchor the existence of any digital artifact on Ethereum Sepolia,
            without revealing its contents. It&apos;s a lightweight, verifiable timestamp for your
            most important files.
          </p>
        </header>

        <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/70 p-6 text-sm shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03] sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              What is ProofChain?
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              ProofChain is a proof-of-existence dApp. Instead of uploading full documents to a
              blockchain, you upload them to IPFS and store only a small fingerprint (hash / CID) on
              Ethereum. This creates an immutable record that the file existed at a specific point in
              time, owned by a specific wallet address.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                What problem does it solve?
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Many workflows rely on private documents—contracts, NDAs, designs, research, invoices.
                Proving that a file existed before a certain date is hard without trusting a central
                system. ProofChain gives you an independent, tamper-resistant timestamp and ownership
                record for those files.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Why use blockchain?
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Blockchains like Ethereum provide immutable history and global verifiability. Once a
                proof is written on-chain, no single party can alter or delete it. Anyone can verify
                the proof using standard Ethereum tooling, even without interacting with this app.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Real-world use cases
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-400">
              <li>Proving authorship of creative work (designs, manuscripts, music, code).</li>
              <li>Anchoring contract versions or NDAs without exposing sensitive terms.</li>
              <li>Timestamping research data, experiment results, or IP disclosures.</li>
              <li>Providing verifiable receipts, invoices, or compliance documents.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              How ProofChain works
            </h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-600 dark:text-slate-400">
              <li>Upload a file and pin it to IPFS to get a content identifier (CID).</li>
              <li>Store the CID, a title, and your wallet address on Ethereum Sepolia.</li>
              <li>Share a public verification link so others can independently validate the record.</li>
            </ol>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Only the hash / CID and minimal metadata are stored on-chain. The document contents stay
              off-chain and under your control.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}


