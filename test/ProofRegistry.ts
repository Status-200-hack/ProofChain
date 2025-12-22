import { expect } from "chai";
import { ethers } from "hardhat";

describe("ProofRegistry", function () {
  async function deploy() {
    const [owner, other] = await ethers.getSigners();
    const ProofRegistry = await ethers.getContractFactory("ProofRegistry");
    const proofRegistry = await ProofRegistry.deploy();
    await proofRegistry.waitForDeployment();
    return { proofRegistry, owner, other };
  }

  it("stores and returns proofs", async function () {
    const { proofRegistry, owner } = await deploy();
    const title = "Document A";
    const hash = "QmProofHash";

    const tx = await proofRegistry.createProof(title, hash);
    const receipt = await tx.wait();
    const event = receipt!.logs.find(() => true);
    expect(event).to.not.be.undefined;

    const count = await proofRegistry.proofCount();
    expect(count).to.equal(1n);

    const proof = await proofRegistry.getProof(0);
    expect(proof.owner).to.equal(owner.address);
    expect(proof.title).to.equal(title);
    expect(proof.ipfsHash).to.equal(hash);
  });

  it("rejects empty hashes", async function () {
    const { proofRegistry, other } = await deploy();
    await expect(
      proofRegistry.connect(other).createProof("oops", "")
    ).to.be.revertedWith("ipfsHash required");
  });
});

