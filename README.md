# ProofChain

ProofChain is a proof‑of‑existence dApp built on **Ethereum Sepolia**, letting users anchor document fingerprints (IPFS CIDs / hashes) on‑chain and verify them later via shareable links.

The frontend is a modern **Next.js App Router** app with a **Web3 SaaS** feel, and the backend logic is a simple, auditable **Hardhat** smart contract.

---

## Features

- **Proof creation**
  - Upload any file to IPFS (via Pinata).
  - Get a CID and register it on Ethereum Sepolia with a human‑readable title.
  - Transaction status + confirmations surfaced in the UI.

- **Verification**
  - Public verification page: `/verify/[proofId]`
  - Shows title, owner address, timestamp, IPFS link.
  - Copyable share link so anyone can independently verify proofs.

- **Dashboard**
  - Wallet‑gated `/dashboard` page.
  - Lists **only proofs created by the connected wallet**.
  - On‑chain visualization: animated chain of blocks with Genesis block, pulsing glow, and data‑flow connectors.

- **UX / UI**
  - Modern, responsive layout (desktop + mobile).
  - Navbar with routing: Home, Create, Verify, Dashboard, About.
  - Wallet connect + disconnect (desktop + mobile).
  - Clean dark mode‑friendly aesthetics (radial gradients, glassmorphism).

- **Smart contract**
  - Minimal `ProofRegistry` contract that stores:
    - `owner` (address)
    - `ipfsHash` (IPFS CID or hash)
    - `title` (string)
    - `timestamp` (uint256)
  - Read helpers: `getProof(id)` and `getProofs()` for small datasets.

---

## Tech Stack

- **Frontend**
  - Next.js 16 (App Router)
  - React + TypeScript
  - Tailwind CSS v4 (inline `@theme`)
  - wagmi v3 + viem + ethers v6
  - WalletConnect, MetaMask / injected providers, Coinbase Wallet

- **Smart Contracts / Tooling**
  - Solidity `^0.8.20`
  - Hardhat + `@nomicfoundation/hardhat-toolbox`
  - TypeChain

- **Infra**
  - Ethereum Sepolia network
  - IPFS via Pinata

---

## Project Structure

```text
ProofChain/
  contracts/
    ProofRegistry.sol        # Solidity contract
  scripts/
    deploy.ts                # Hardhat deployment script
  src/
    app/
      page.tsx               # Landing page (/)
      create/page.tsx        # Create proof (/create)
      verify/page.tsx        # Verify by ID input (/verify)
      verify/[id]/page.tsx   # Public proof page (/verify/[id])
      dashboard/page.tsx     # Wallet dashboard + visualization
      about/page.tsx         # About + use cases
      api/pinata/route.ts    # IPFS upload API (Pinata)
      layout.tsx             # Root layout + NavBar + providers
      globals.css            # Tailwind + global styles
    components/
      NavBar.tsx
      WalletStatus.tsx
      FileUpload.tsx
      ProofForm.tsx
      ProofList.tsx
      ProofChainVisualizer.tsx
    lib/
      abi/proofRegistry.ts   # ABI + address helper
      wagmi/config.ts        # wagmi/viem client config
  hardhat.config.ts
  package.json
  env.example
  README.md                  # (this file)
```

---

## Prerequisites

- Node.js **18+**
- npm
- Funded Sepolia wallet for deployment / interactions
- Pinata account (for IPFS uploads)

---

## Setup

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Copy the example file and fill in values:

```bash
cp env.example .env.local
```

Required values:

- **Frontend**
  - `NEXT_PUBLIC_SEPOLIA_RPC_URL` – HTTPS Sepolia RPC endpoint
  - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` – WalletConnect Cloud project id
  - `NEXT_PUBLIC_PROOF_CONTRACT_ADDRESS` – Deployed `ProofRegistry` address

- **Hardhat / deployment**
  - `SEPOLIA_RPC_URL` – Same or separate Sepolia RPC endpoint
  - `PRIVATE_KEY` – Deployer wallet private key (Sepolia)
  - `ETHERSCAN_API_KEY` – Optional, for contract verification

- **IPFS / Pinata**
  - `PINATA_API_KEY`
  - `PINATA_SECRET_API_KEY`

---

## Running the App

### Development server

```bash
npm run dev
# visit http://localhost:3000
```

Changes are hot‑reloaded.

### Hardhat tests

```bash
npm run test:contracts
```

### Deploy contract to Sepolia

```bash
npm run deploy:sepolia
```

After deployment, set:

- `NEXT_PUBLIC_PROOF_CONTRACT_ADDRESS` to the printed contract address,
- then restart `npm run dev`.

(Optional) Verify on Etherscan:

```bash
cross-env TS_NODE_PROJECT=tsconfig.hardhat.json npx hardhat verify --network sepolia <deployed_address>
```

---

## Key Flows

### Create a proof (`/create`)

1. Connect a wallet via the navbar.
2. Upload a file using the **IPFS upload** card (Pinata).
3. Copy the resulting CID.
4. In the proof form:
   - Enter a **Title** (e.g., “NDA v1 PDF”).
   - Paste the **CID** (or any hash).
5. Click **Register Proof** to anchor it on Ethereum Sepolia.

### Verify a proof (`/verify` and `/verify/[id]`)

- `/verify`: enter a **Proof ID** and click **Verify Proof** to redirect.
- `/verify/[id]`: public page that:
  - Validates ID using `proofCount`.
  - Fetches proof via `getProof(id)`.
  - Displays title, owner, timestamp, IPFS link.
  - Offers a **Copy link** button for sharing.

### Dashboard (`/dashboard`)

- Requires a connected wallet.
- Top: animated chain of cubes representing the wallet’s proofs.
  - **Genesis Block** = first (oldest) proof.
  - Pulsing glow + animated connectors to feel “on-chain”.
- Bottom: table/list of proofs filtered to the connected address.

---

## Scripts

```bash
npm run dev            # Start Next.js dev server
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Run ESLint
npm run hardhat        # Run Hardhat CLI
npm run test:contracts # Run Hardhat tests
npm run deploy:sepolia # Deploy ProofRegistry to Sepolia
```

---

## Security / Notes

- Only minimal metadata + hash/CID are stored on‑chain; **documents themselves stay off‑chain**.
- This is a demo‑grade contract and UI:
  - No advanced access control.
  - No gas optimizations or batching.
- For production:
  - Consider multi‑network support (L2s).
  - Add rate limiting & auth around the Pinata API route.
  - Review and harden contract with audits.

---

## License

MIT. See `LICENSE` (add one if not present).

---

## Credits

Built with:

- [Next.js](https://nextjs.org)
- [wagmi](https://wagmi.sh)
- [Hardhat](https://hardhat.org)
- [Pinata](https://www.pinata.cloud)

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
