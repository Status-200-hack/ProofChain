'use client';

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useChainId, useChains, useSwitchChain } from "wagmi";
import { useMemo, useEffect, useState } from "react";

export default function WalletStatus() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const chains = useChains();
  const { disconnect } = useDisconnect();
  const { connectors, connect, status, error } = useConnect();
  const { switchChain, isPending: isSwitching, error: switchError } = useSwitchChain();
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== 'undefined') {
      setIsMetaMaskInstalled(Boolean(window.ethereum?.isMetaMask));
    }
  }, []);

  const targetChain = chains.find((c) => c.name === "Sepolia" || c.id === 11155111);
  const onWrongNetwork = Boolean(targetChain && chainId && chainId !== targetChain.id);

  const shortAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const handleConnect = (connector: any) => {
    if (!isMetaMaskInstalled && connector.id === 'injected') {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }
    connect({ connector });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/40 p-4 shadow-sm backdrop-blur dark:border-white/5 dark:bg-white/5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Wallet</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-white">
            {isConnected ? shortAddress : "Not connected"}
          </p>
          {onWrongNetwork && targetChain ? (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              Wrong network. Please switch to {targetChain.name}.
            </p>
          ) : null}
          {error ? <p className="mt-1 text-xs text-red-500">{error.message}</p> : null}
          {switchError ? (
            <p className="mt-1 text-xs text-red-500">{switchError.message}</p>
          ) : null}
        </div>
        {isConnected ? (
          <div className="flex gap-2">
            {onWrongNetwork && targetChain ? (
              <button
                disabled={isSwitching}
                onClick={() => switchChain({ chainId: targetChain.id })}
                className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-amber-600 disabled:opacity-60"
              >
                {isSwitching ? "Switching..." : "Switch to Sepolia"}
              </button>
            ) : null}
            <button
              onClick={() => disconnect()}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-600"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-end gap-2">
            {connectors.map((connector) => {
              const isMetaMaskConnector = connector.id === 'injected' || connector.name === 'MetaMask';
              const isDisabled = status === "pending";
              
              return (
                <button
                  key={connector.id}
                  disabled={isDisabled}
                  onClick={() => handleConnect(connector)}
                  className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  title={isMetaMaskConnector && !isMetaMaskInstalled ? 'Install MetaMask' : undefined}
                >
                  {connector.name}
                </button>
              );
            })}
            {!isMetaMaskInstalled && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                MetaMask not detected. Please install MetaMask extension.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

