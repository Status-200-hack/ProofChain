'use client';

import { useState, useEffect, FormEvent } from "react";
import { useAccount, useChainId, useReadContract, useWriteContract } from "wagmi";
import { sepolia } from "wagmi/chains";
import { useWaitForTransactionReceipt } from "wagmi";
import { proofRegistryAbi, proofRegistryAddress } from "@/lib/abi/proofRegistry";
import WalletStatus from "@/components/WalletStatus";
import FileUpload from "@/components/FileUpload";

export default function NewProofPage() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const [title, setTitle] = useState("");
  const [cid, setCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [proofId, setProofId] = useState<bigint | null>(null);

  const {
    writeContractAsync,
    data: txHash,
    isPending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const {
    data: proofCount,
    refetch: refetchProofCount,
  } = useReadContract({
    address: proofRegistryAddress as `0x${string}`,
    abi: proofRegistryAbi,
    functionName: "proofCount",
    query: {
      enabled: false, // fetch manually after tx finalizes
    },
  });

  const onWrongNetwork = chainId && chainId !== sepolia.id;

  useEffect(() => {
    if (isSuccess) {
      refetchProofCount()
        .then((result) => {
          const value = result.data as bigint | undefined;
          if (typeof value === "bigint" && value > 0n) {
            setProofId(value - 1n);
          }
        })
        .catch(() => {
          // swallow; error will be visible in generic message
        });
    }
  }, [isSuccess, refetchProofCount]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setProofId(null);

    if (!isConnected) {
      setError("Connect your wallet to create a proof.");
      return;
    }
    if (onWrongNetwork) {
      setError("Please switch to the Sepolia network.");
      return;
    }
    if (!proofRegistryAddress) {
      setError("Contract address missing. Set NEXT_PUBLIC_PROOF_CONTRACT_ADDRESS.");
      return;
    }
    if (!title.trim()) {
      setError("Enter a proof title.");
      return;
    }
    if (!cid) {
      setError("Upload a file to IPFS first.");
      return;
    }

    try {
      await writeContractAsync({
        address: proofRegistryAddress as `0x${string}`,
        abi: proofRegistryAbi,
        functionName: "createProof",
        args: [title.trim(), cid],
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Transaction failed";
      setError(message);
    }
  };

  const canSubmit =
    isConnected && !onWrongNetwork && title.trim().length > 0 && cid && !isPending && !isConfirming;

  const etherscanUrl = txHash
    ? `https://sepolia.etherscan.io/tx/${txHash}`
    : undefined;

  return (
    <div className="min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="space-y-4">
          <p className="inline-flex rounded-full bg-indigo-100/90 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-500/10 dark:bg-indigo-500/15 dark:text-indigo-200">
            New proof · Sepolia
          </p>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Upload and anchor a proof.
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
              Connect your wallet, upload a document to IPFS, and anchor its CID on-chain
              with a single transaction.
            </p>
          </div>
        </header>

        <div className="max-w-md">
          <WalletStatus />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  Proof title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
                  placeholder="e.g. NDA v1 PDF"
                />
              </div>

              <FileUpload onUploaded={(hash) => setCid(hash)} />

              {cid ? (
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  IPFS CID selected:{" "}
                  <span className="font-mono break-all text-zinc-800 dark:text-zinc-200">
                    {cid}
                  </span>
                </p>
              ) : null}

              {error ? <p className="text-sm text-red-500">{error}</p> : null}

              {txHash ? (
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Transaction:{" "}
                  {etherscanUrl ? (
                    <a
                      href={etherscanUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-indigo-600 underline dark:text-indigo-300"
                    >
                      {txHash}
                    </a>
                  ) : (
                    <span className="font-mono break-all">{txHash}</span>
                  )}
                </p>
              ) : null}

              {isConfirming ? (
                <p className="text-sm text-indigo-600 dark:text-indigo-300">
                  Waiting for confirmations…
                </p>
              ) : null}

              {isSuccess && proofId !== null ? (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Proof created successfully. ID: {proofId.toString()}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {isPending || isConfirming ? "Creating proof..." : "Create proof"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


