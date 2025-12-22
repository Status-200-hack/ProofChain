'use client';

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { proofRegistryAbi, proofRegistryAddress } from "@/lib/abi/proofRegistry";
import { sepolia } from "wagmi/chains";
import { useWaitForTransactionReceipt } from "wagmi";

type Props = {
  onSubmitted?: () => void;
};

export default function ProofForm({ onSubmitted }: Props) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [title, setTitle] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [error, setError] = useState<string | null>(null);
  const contractAddress = useMemo(() => proofRegistryAddress, []);

  const {
    writeContractAsync,
    data: txHash,
    isPending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess) {
      onSubmitted?.();
    }
  }, [isSuccess, onSubmitted]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isConnected) {
      setError("Connect a wallet to submit a proof.");
      return;
    }

    if (!contractAddress) {
      setError("Contract address missing. Set NEXT_PUBLIC_PROOF_CONTRACT_ADDRESS.");
      return;
    }

    if (chainId && chainId !== sepolia.id) {
      setError("Switch to the Sepolia network.");
      return;
    }

    try {
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: proofRegistryAbi,
        functionName: "createProof",
        args: [title, ipfsHash],
      });
      setTitle("");
      setIpfsHash("");
      onSubmitted?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit";
      setError(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/60 p-6 shadow-lg backdrop-blur dark:border-white/5 dark:bg-white/[0.04]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Submit Proof</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Anchor a hash or CID on Sepolia.
          </p>
        </div>
        <div className="text-right text-xs text-zinc-500 dark:text-zinc-400">
          Network: Sepolia
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-100">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
            placeholder="e.g. NDA v1 PDF"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-100">
            IPFS hash / CID
          </label>
          <input
            value={ipfsHash}
            onChange={(e) => setIpfsHash(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
            placeholder="IPFS CID or sha256"
            required
          />
        </div>
      </div>

      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
      {isSuccess ? (
        <p className="mt-2 text-sm text-green-600">Proof stored on-chain.</p>
      ) : null}
      {isConfirming ? (
        <p className="mt-2 text-sm text-indigo-600">Waiting for confirmations…</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending || isConfirming}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending || isConfirming ? "Submitting..." : "Register Proof"}
      </button>
    </form>
  );
}

