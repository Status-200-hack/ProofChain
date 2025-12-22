import { ethers } from "hardhat";

async function main() {
  const ProofRegistry = await ethers.getContractFactory("ProofRegistry");
  const proofRegistry = await ProofRegistry.deploy();

  await proofRegistry.waitForDeployment();

  console.log(`ProofRegistry deployed to: ${proofRegistry.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

