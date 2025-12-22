# ProofChain

Proof-of-existence dApp built with Next.js 14 (App Router), wagmi + ethers v6, Tailwind CSS, and Hardhat. Deploys a `ProofRegistry` contract to Ethereum Sepolia to anchor document hashes or CIDs on-chain.

## Stack
- Next.js 14 + TypeScript + App Router
- wagmi 3 + ethers v6 + React Query
- Tailwind CSS (v4, @import-based)
- Hardhat + @nomicfoundation/hardhat-toolbox
- Network: Ethereum Sepolia

## Project structure
- `src/app` – UI pages and layout
- `src/components` – Wallet UI and proof form/list components
- `src/lib/abi` – Contract ABI + address helper
- `src/lib/wagmi` – wagmi client configuration
- `contracts` – Solidity sources (`ProofRegistry.sol`)
- `scripts` – Hardhat deployment scripts
- `test` – Hardhat tests

## Prerequisites
- Node.js 18+
- npm
- Funded Sepolia wallet (for deployment/interaction)

## Setup
1) Install dependencies
```bash
npm install
```

2) Copy env template and fill values
```bash
cp env.example .env.local
```
Required values:
- `NEXT_PUBLIC_SEPOLIA_RPC_URL` – HTTPS RPC endpoint
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` – WalletConnect Cloud project id
- `NEXT_PUBLIC_PROOF_CONTRACT_ADDRESS` – Deployed ProofRegistry address
- `SEPOLIA_RPC_URL`, `PRIVATE_KEY`, `ETHERSCAN_API_KEY` – used by Hardhat

3) Run the web app
```bash
npm run dev
# open http://localhost:3000
```

## Hardhat
All Hardhat commands automatically use `tsconfig.hardhat.json` via `cross-env`.

- Run tests:
```bash
npm run test:contracts
```

- Deploy to Sepolia:
```bash
npm run deploy:sepolia
```
After deployment, set `NEXT_PUBLIC_PROOF_CONTRACT_ADDRESS` to the printed address.

## IPFS via Pinata
- Add to `.env.local`:
```
PINATA_API_KEY=...
PINATA_SECRET_API_KEY=...
```
- Use the "Upload to IPFS (Pinata)" widget in the UI to pin any file. Progress and resulting CID will be shown. Secrets stay server-side; the client only calls your `/api/pinata` route.

- Verify (optional):
```bash
cross-env TS_NODE_PROJECT=tsconfig.hardhat.json npx hardhat verify --network sepolia <address>
```

## DApp usage
1) Ensure `NEXT_PUBLIC_PROOF_CONTRACT_ADDRESS` points to a deployed `ProofRegistry` on Sepolia.
2) Connect a wallet (injected, WalletConnect, or Coinbase Wallet).
3) Submit a label and proof hash/CID; wait for confirmations.
4) Recent proofs render in the list with submitter, timestamp, and stored hash.

## Notes
- Contract is intentionally simple for demo purposes (stores small proof metadata on-chain).
- Tailwind v4 uses `@import "tailwindcss";` and inline theme tokens; no config file is needed.
