'use client';

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useReadContract } from "wagmi";
import { proofRegistryAbi, proofRegistryAddress } from "@/lib/abi/proofRegistry";
import Image from "next/image";
import { decodeProofSlug } from "@/lib/proofId";

export default function VerifyProofPage() {
  const params = useParams<{ id: string }>();
  const slug = params?.id;

  const idBigInt = useMemo(() => {
    if (!slug) return null;
    try {
      const decoded = decodeProofSlug(slug);
      if (decoded === null) return null;
      const zero = BigInt(0);
      if (decoded < zero) return null;
      return decoded;
    } catch {
      return null;
    }
  }, [slug]);

  const {
    data: total,
    isLoading: isLoadingCount,
    error: countError,
  } = useReadContract({
    address: proofRegistryAddress as `0x${string}`,
    abi: proofRegistryAbi,
    functionName: "proofCount",
  });

  const isIdInRange =
    idBigInt !== null &&
    typeof total === "bigint" &&
    total > BigInt(0) &&
    idBigInt < (total as bigint);

  const {
    data: proof,
    isLoading: isLoadingProof,
    error: proofError,
  } = useReadContract({
    address: proofRegistryAddress as `0x${string}`,
    abi: proofRegistryAbi,
    functionName: "getProof",
    args: idBigInt !== null ? [idBigInt] : undefined,
    query: {
      enabled: Boolean(proofRegistryAddress) && isIdInRange,
    },
  });

  const isLoading = isLoadingCount || isLoadingProof;
  const ipfsLink =
    proof && (proof as any).ipfsHash
      ? `https://ipfs.io/ipfs/${(proof as any).ipfsHash}`
      : null;

  const invalid =
    idBigInt === null ||
    countError ||
    (!isLoading && !isIdInRange) ||
    proofError;

  const [copyLabel, setCopyLabel] = useState("Copy link");

  const handleCopyLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy link"), 2000);
    } catch {
      setCopyLabel("Failed to copy");
      setTimeout(() => setCopyLabel("Copy link"), 2000);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50 sm:py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 sm:gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 px-3 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-500/10 dark:bg-emerald-500/15 dark:text-emerald-200 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Verified on Ethereum (Sepolia)
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              Proof {slug ? `#${slug}` : "#"}
            </h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 sm:mt-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <span className="text-xs">Ξ</span>
              </span>
              <span className="leading-relaxed">
                On-chain record of this document&apos;s existence and ownership on Ethereum Sepolia.
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-xs font-medium text-slate-800 shadow-sm transition hover:border-indigo-400 sm:self-auto dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-indigo-500"
          >
            <span className="text-sm">🔗</span>
            <span>{copyLabel}</span>
          </button>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/70 p-5 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03] sm:p-6">
          {isLoading ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading proof…</p>
          ) : invalid ? (
            <p className="text-sm text-red-500">
              Could not find a proof with id {slug}. Please check the id and try again.
            </p>
          ) : proof ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Title
                </p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white sm:text-xl">
                  {(proof as any).title || "Untitled proof"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Owner
                </p>
                <p className="break-all font-mono text-sm text-zinc-800 dark:text-zinc-200">
                  {(proof as any).owner}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Timestamp
                </p>
                <p className="text-sm text-zinc-800 dark:text-zinc-200">
                  {new Date(Number((proof as any).timestamp) * 1000).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  IPFS
                </p>
                {ipfsLink ? (
                  <a
                    className="break-all text-sm font-semibold text-indigo-600 underline hover:text-indigo-700 dark:text-indigo-300"
                    href={ipfsLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {ipfsLink}
                  </a>
                ) : (
                  <p className="text-sm text-zinc-800 dark:text-zinc-200">No hash available</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}


