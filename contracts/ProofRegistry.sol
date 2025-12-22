// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ProofRegistry
/// @notice Minimal proof-of-existence registry storing document metadata on-chain.
/// @dev Optimized for clarity; no gas optimizations or batching logic.
contract ProofRegistry {
    /// @notice Core proof data stored on-chain.
    /// @param owner Address that created the proof entry.
    /// @param ipfsHash IPFS content identifier or hash for the document.
    /// @param title Short human-readable title for the proof.
    /// @param timestamp Block timestamp when the proof was created.
    struct Proof {
        address owner;
        string ipfsHash;
        string title;
        uint256 timestamp;
    }

    /// @notice Mapping of proof id to stored proof.
    mapping(uint256 => Proof) public proofs;

    /// @notice Total number of proofs created. Also the next id to be assigned.
    uint256 public proofCount;

    /// @notice Emitted when a new proof is created.
    /// @param id Newly assigned proof id.
    /// @param owner Address that submitted the proof.
    /// @param ipfsHash IPFS content identifier / hash of the proof.
    /// @param timestamp Block timestamp when stored.
    event ProofCreated(uint256 indexed id, address indexed owner, string ipfsHash, uint256 timestamp);

    /// @notice Create and store a new proof entry.
    /// @param title Short label for the proof (e.g., file name or description).
    /// @param ipfsHash IPFS CID or hash pointing to the off-chain artifact.
    /// @return id The assigned proof id.
    function createProof(string calldata title, string calldata ipfsHash) external returns (uint256 id) {
        require(bytes(ipfsHash).length > 0, "ipfsHash required");

        id = proofCount;

        proofs[id] = Proof({
            owner: msg.sender,
            ipfsHash: ipfsHash,
            title: title,
            timestamp: block.timestamp
        });

        proofCount += 1;

        emit ProofCreated(id, msg.sender, ipfsHash, block.timestamp);
    }

    /// @notice Fetch a stored proof by id.
    /// @param id Proof id to look up.
    /// @return proof The stored Proof struct.
    function getProof(uint256 id) external view returns (Proof memory proof) {
        require(id < proofCount, "invalid id");
        proof = proofs[id];
    }

    /// @notice Fetch all stored proofs. Intended for small demo datasets.
    /// @return items Array of all stored proofs in insertion order.
    function getProofs() external view returns (Proof[] memory items) {
        items = new Proof[](proofCount);
        for (uint256 i = 0; i < proofCount; i++) {
            items[i] = proofs[i];
        }
    }
}

