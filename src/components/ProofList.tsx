'use client';

import { useEffect, useMemo } from "react";
import { useReadContract, useAccount } from "wagmi";
import { proofRegistryAbi, proofRegistryAddress } from "@/lib/abi/proofRegistry";
import Link from "next/link";

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
  const { address, isConnected } = useAccount();
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

  const allProofs = (data as Proof[]) ?? [];
  
  // Filter proofs to only show those owned by the connected wallet
  // Preserve the original contract proof ID (array index) for verify links
  const proofs = useMemo(() => {
    if (!isConnected || !address) {
      return [];
    }
    // Compare addresses in lowercase to handle case differences
    // Map includes the original index (contract proof ID) for verify links
    return allProofs
      .map((proof, index) => ({ ...proof, contractId: index }))
      .filter(
        (proof) => proof.owner.toLowerCase() === address.toLowerCase()
      );
  }, [allProofs, isConnected, address]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/60 p-4 shadow-lg backdrop-blur dark:border-white/5 dark:bg-white/[0.04] sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600">My Proofs</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
            {isConnected ? "Your on-chain submissions" : "Connect wallet to view your proofs"}
          </p>
        </div>
        {isConnected && (
          <span className="self-start rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200 sm:self-auto">
            {proofs.length} {proofs.length === 1 ? "proof" : "proofs"}
          </span>
        )}
      </div>

      {!proofRegistryAddress ? (
        <p className="text-sm text-red-500">
          Set NEXT_PUBLIC_PROOF_CONTRACT_ADDRESS to read on-chain data.
        </p>
      ) : !isConnected ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Connect your wallet to view your proofs.
        </p>
      ) : isLoading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</p>
      ) : proofs.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No proofs found for your wallet. Submit your first one!
        </p>
      ) : (
        <div className="space-y-3">
          {proofs
            .reverse()
            .map((proof) => (
              <Link
                key={proof.contractId}
                href={`/verify/${proof.contractId}`}
                className="block rounded-2xl border border-zinc-200/70 bg-white/90 px-4 py-3 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-indigo-700 dark:hover:bg-indigo-900/20"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                      {proof.title || "Untitled proof"}
                    </p>
                    <p className="mt-0.5 break-all text-[11px] text-zinc-500 dark:text-zinc-400">
                      {proof.ipfsHash}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 sm:text-xs">
                      {new Date(Number(proof.timestamp) * 1000).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-zinc-500 dark:text-zinc-400">
                    <p>By</p>
                    <p className="font-mono break-all sm:break-normal">{shorten(proof.owner)}</p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}

function shorten(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

