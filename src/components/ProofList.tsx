'use client';

import { useEffect } from "react";
import { useReadContract } from "wagmi";
import { proofRegistryAbi, proofRegistryAddress } from "@/lib/abi/proofRegistry";

type Proof = {
  owner: string;
  ipfsHash: string;
  title: string;
  timestamp: bigint;
};

type Props = {
  refreshKey: number;
};

export default function ProofList({ refreshKey }: Props) {
  const { data, isLoading, refetch } = useReadContract({
    address: proofRegistryAddress as `0x${string}`,
    abi: proofRegistryAbi,
    functionName: "getProofs",
    query: {
      enabled: Boolean(proofRegistryAddress),
    },
  });

  useEffect(() => {
    refetch();
  }, [refreshKey, refetch]);

  const proofs = (data as Proof[]) ?? [];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/60 p-6 shadow-lg backdrop-blur dark:border-white/5 dark:bg-white/[0.04]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Proofs</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Latest on-chain submissions
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
          {proofs.length} total
        </span>
      </div>

      {!proofRegistryAddress ? (
        <p className="text-sm text-red-500">
          Set NEXT_PUBLIC_PROOF_CONTRACT_ADDRESS to read on-chain data.
        </p>
      ) : isLoading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</p>
      ) : proofs.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No proofs yet. Submit the first one!
        </p>
      ) : (
        <div className="space-y-3">
          {proofs
            .map((proof, index) => ({ ...proof, index }))
            .reverse()
            .map((proof) => (
              <div
                key={proof.index}
                className="rounded-2xl border border-zinc-200/70 bg-white/90 px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {proof.title || "Untitled proof"}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {proof.ipfsHash}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(Number(proof.timestamp) * 1000).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-zinc-500 dark:text-zinc-400">
                    <p>By</p>
                    <p className="font-mono">{shorten(proof.owner)}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

function shorten(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

