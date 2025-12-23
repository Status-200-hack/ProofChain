'use client';

import { useState, useEffect, FormEvent } from "react";
import { useAccount, useChainId, useReadContract, useWriteContract, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { useWaitForTransactionReceipt } from "wagmi";
import { proofRegistryAbi, proofRegistryAddress } from "@/lib/abi/proofRegistry";
import WalletStatus from "@/components/WalletStatus";
import FileUpload from "@/components/FileUpload";

export default function NewProofPage() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const [title, setTitle] = useState("");
  const [cid, setCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [proofId, setProofId] = useState<bigint | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleCopyCID = async () => {
    if (!cid) return;
    
    try {
      await navigator.clipboard.writeText(cid);
      setShowToast(true);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = cid;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShowToast(true);
      } catch (fallbackErr) {
        setError('Failed to copy CID');
      }
      document.body.removeChild(textArea);
    }
  };

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
          const zero = BigInt(0);
          const one = BigInt(1);
          if (typeof value === "bigint" && value > zero) {
            setProofId(value - one);
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
    // Auto-switch to Sepolia if on wrong network
    if (onWrongNetwork) {
      try {
        await switchChain({ chainId: sepolia.id });
        setError("Switching to Sepolia network... Please try again.");
        return;
      } catch (switchErr: unknown) {
        const switchMessage = switchErr instanceof Error ? switchErr.message : "Failed to switch network";
        setError(`Please switch to Sepolia network manually. ${switchMessage}`);
        return;
      }
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
    isConnected && !onWrongNetwork && title.trim().length > 0 && cid && !isPending && !isConfirming && !isSwitching;

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
                <div className="flex items-center gap-2">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    IPFS CID selected:
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyCID}
                    className="group flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-mono font-semibold text-emerald-700 transition hover:bg-emerald-100 hover:shadow-sm dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                    title="Click to copy CID"
                  >
                    <svg
                      className="h-3.5 w-3.5 transition-transform group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="break-all">{cid}</span>
                  </button>
                </div>
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
                {isSwitching ? "Switching network..." : isPending || isConfirming ? "Creating proof..." : "Create proof"}
              </button>
            </form>
          </div>
        </div>
        
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-lg dark:border-emerald-800 dark:bg-emerald-900/90">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                CID copied to clipboard!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


