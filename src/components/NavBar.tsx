'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useMemo, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Create Proof" },
  { href: "/verify", label: "Verify Proof" },
  { href: "/dashboard", label: "My Proofs" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { connect, connectors, status } = useConnect();
  const { disconnect } = useDisconnect();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const shortAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const handleConnect = () => {
    const connector = connectors[0];
    if (!connector) return;
    connect({ connector });
  };

  const isConnecting = status === "pending";

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <nav className="sticky top-0 z-30 border-b border-white/10 bg-white/80 px-3 py-2.5 backdrop-blur-md dark:border-white/5 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-xl"
            onClick={closeMobile}
          >
            ProofChain
          </Link>
          {/* Desktop links */}
          <div className="hidden items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 md:flex md:text-sm md:gap-3">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1 transition ${
                    active
                      ? "bg-slate-900 text-slate-50 shadow-sm dark:bg-slate-50 dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/70"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop wallet button */}
          <div className="hidden items-center md:flex">
            {!isConnected ? (
              <button
                type="button"
                onClick={handleConnect}
                disabled={isConnecting || connectors.length === 0}
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => disconnect()}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-3 py-1.5 text-[11px] font-mono font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-slate-500"
              >
                {shortAddress}
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 p-1.5 text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-slate-500 md:hidden"
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={isMobileOpen}
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="flex flex-col gap-[3px]">
              <span
                className={`h-[2px] w-4 rounded bg-current transition-transform ${
                  isMobileOpen ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[2px] w-4 rounded bg-current transition-opacity ${
                  isMobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-[2px] w-4 rounded bg-current transition-transform ${
                  isMobileOpen ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-white/95 p-3 text-sm shadow-lg backdrop-blur-md dark:border-white/5 dark:bg-slate-950/95 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={`rounded-xl px-3 py-2 text-sm transition ${
                    active
                      ? "bg-slate-900 text-slate-50 shadow-sm dark:bg-slate-50 dark:text-slate-900"
                      : "text-slate-700 hover:bg-slate-100/90 dark:text-slate-200 dark:hover:bg-slate-800/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-3 border-t border-slate-200/70 pt-3 dark:border-slate-800">
            {!isConnected ? (
              <button
                type="button"
                onClick={() => {
                  handleConnect();
                  closeMobile();
                }}
                disabled={isConnecting || connectors.length === 0}
                className="flex w-full items-center justify-center rounded-full bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  disconnect();
                  closeMobile();
                }}
                className="flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-2 text-[11px] font-mono font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500"
              >
                {shortAddress}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}


