'use client';

import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { proofRegistryAbi, proofRegistryAddress } from "@/lib/abi/proofRegistry";
import { useEffect, useMemo, useRef } from "react";

type Proof = {
  owner: string;
  ipfsHash: string;
  title: string;
  timestamp: bigint;
};

export default function ProofChainVisualizer() {
  const { address, isConnected } = useAccount();
  const chainRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, refetch } = useReadContract({
    address: proofRegistryAddress as `0x${string}`,
    abi: proofRegistryAbi,
    functionName: "getProofs",
    query: {
      enabled: Boolean(proofRegistryAddress),
    },
  });

  useEffect(() => {
    if (isConnected) {
      refetch();
    }
  }, [isConnected, refetch]);

  const allProofs = (data as Proof[]) ?? [];

  const proofs = useMemo(() => {
    if (!isConnected || !address) return [];
    return allProofs
      .map((proof, index) => ({ ...proof, contractId: index }))
      .filter((proof) => proof.owner.toLowerCase() === address.toLowerCase())
      .sort(
        (a, b) =>
          Number(a.timestamp ?? 0n) - Number(b.timestamp ?? 0n),
      );
  }, [allProofs, isConnected, address]);

  const hasProofs = proofs.length > 0;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const px = (x || 0) * 4; // max 4px shift
    const py = (y || 0) * 3;

    if (chainRef.current) {
      chainRef.current.style.setProperty("--pc-parallax-x", `${px}px`);
      chainRef.current.style.setProperty("--pc-parallax-y", `${py}px`);
    }
  };

  const handleMouseLeave = () => {
    if (chainRef.current) {
      chainRef.current.style.setProperty("--pc-parallax-x", "0px");
      chainRef.current.style.setProperty("--pc-parallax-y", "0px");
    }
  };

  if (!proofRegistryAddress) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/60 px-4 py-5 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03] sm:px-6 sm:py-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
            On-chain visualization
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isConnected
              ? "Each block represents one of your proofs linked on Ethereum."
              : "Connect your wallet to see your proofs as a chain of blocks."}
          </p>
        </div>
      </div>

      <div className="relative overflow-x-auto overflow-y-visible pb-2">
        <div
          ref={chainRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="flex min-h-[120px] items-center gap-4 sm:gap-6"
        >
          {!isConnected ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <PlaceholderBlock key={index} index={index} />
              ))}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect wallet to visualize your blockchain.
              </p>
            </>
          ) : isLoading ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading blocks…</p>
          ) : !hasProofs ? (
            <EmptyChain />
          ) : (
            proofs.map((proof, index) => (
              <BlockItem
                key={proof.contractId}
                proof={proof}
                index={index}
                total={proofs.length}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

type BlockItemProps = {
  proof: Proof & { contractId: number };
  index: number;
  total: number;
};

function BlockItem({ proof, index, total }: BlockItemProps) {
  const timestampDate = new Date(Number(proof.timestamp) * 1000);
  const formattedTimestamp = timestampDate.toLocaleString();
  const displayTitle =
    proof.title && proof.title.length > 18
      ? `${proof.title.slice(0, 16)}…`
      : proof.title || "Untitled proof";
  const isGenesis = index === 0;
  const blockOffset = index % 2 === 0 ? "-2px" : "2px";

  return (
    <>
      <Link
        href={`/verify/${proof.contractId}`}
        className={`group pc-block relative inline-flex min-w-[130px] flex-col rounded-2xl bg-gradient-to-br px-3 py-3 text-xs shadow-[0_12px_30px_rgba(15,23,42,0.55)] outline-none ring-1 sm:min-w-[150px] ${
          isGenesis
            ? "from-cyan-400/50 via-slate-900 to-slate-950 ring-cyan-300/60"
            : "from-indigo-500/40 via-slate-900 to-slate-950 ring-indigo-400/40"
        } ${isGenesis ? "ml-1 sm:ml-2" : ""}`}
        style={{
          animationDelay: `${index * 160}ms`,
          ["--pc-block-offset" as any]: blockOffset,
        }}
      >
        {/* Ethereum watermark */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -right-4 -bottom-6 h-16 w-16 rounded-full border border-indigo-400/30 bg-indigo-500/5 blur-sm" />
          <div className="absolute -right-1 -bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-[11px] text-indigo-100">
            Ξ
          </div>
        </div>

        {/* Status dot */}
        <span
          className={`absolute -top-1 -left-1 h-3 w-3 rounded-full shadow-[0_0_0_4px_rgba(16,185,129,0.35)] ${
            isGenesis
              ? "bg-cyan-300 shadow-[0_0_0_4px_rgba(34,211,238,0.6)]"
              : "bg-emerald-400"
          }`}
        />

        <div
          className="relative flex flex-col gap-1 pc-animate-fade-in-up"
          style={{ animationDelay: `${index * 120}ms` }}
        >
          <p className="truncate text-[11px] font-semibold text-slate-50">
            {displayTitle} {isGenesis && <span className="text-[9px] text-cyan-200">· Genesis</span>}
          </p>
          <p className="text-[10px] text-indigo-100/80">
            Block #{proof.contractId} ·{" "}
            <span className="font-mono text-[9px] text-indigo-100/70">
              {shortenHash(proof.ipfsHash)}
            </span>
          </p>

          <p className="mt-1 line-clamp-2 text-[10px] text-slate-200/80">
            Block anchored on Ethereum at
            <br />
            {formattedTimestamp}
          </p>
        </div>

      </Link>

      {/* Connector line, except after last block */}
      {index < total - 1 && (
        <div className="pc-connector hidden h-[2px] w-10 flex-none rounded-full bg-slate-700/40 sm:block" />
      )}
    </>
  );
}

type PlaceholderBlockProps = {
  index: number;
};

function PlaceholderBlock({ index }: PlaceholderBlockProps) {
  return (
    <>
      <div
        className="pc-block relative inline-flex min-w-[110px] flex-col rounded-2xl bg-gradient-to-br from-slate-700/40 via-slate-900 to-slate-950 px-3 py-3 text-xs opacity-80 shadow-[0_10px_24px_rgba(15,23,42,0.5)] sm:min-w-[130px]"
        style={{ animationDelay: `${index * 120}ms` }}
      >
        <div className="absolute -right-4 -bottom-6 h-12 w-12 rounded-full border border-slate-500/40 bg-slate-600/10 blur-sm" />
        <p className="text-[11px] font-semibold text-slate-100/80">Block placeholder</p>
        <p className="mt-1 text-[10px] text-slate-400">
          Connect wallet to see your proofs as blocks.
        </p>
      </div>
      {index < 2 && (
        <div className="pc-connector hidden h-[2px] w-8 flex-none rounded-full bg-slate-600/40 sm:block" />
      )}
    </>
  );
}

function EmptyChain() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 py-3 text-center sm:py-4">
      <div className="flex items-center gap-3">
        <div className="pc-block h-8 w-8 rounded-2xl border border-dashed border-slate-500/50 bg-slate-900/40" />
        <div className="pc-connector hidden h-[2px] w-10 rounded-full bg-slate-600/40 sm:block" />
        <div className="pc-block hidden h-8 w-8 rounded-2xl border border-dashed border-slate-600/60 bg-slate-900/40 sm:block" />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        No blocks yet. Your first proof will create the genesis block.
      </p>
    </div>
  );
}

function shortenHash(value: string) {
  if (!value) return "";
  if (value.length <= 10) return value;
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}


