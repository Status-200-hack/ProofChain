// Simple reversible obfuscation for proof IDs used in URLs.
// NOTE: This is **not** security, just makes IDs non-obvious.
const OFFSET = 987_653; // arbitrary positive constant within Number.MAX_SAFE_INTEGER

export function encodeProofId(id: bigint | number): string {
  const n = typeof id === "bigint" ? Number(id) : id;
  if (!Number.isSafeInteger(n) || n < 0) {
    throw new Error("Invalid proof id to encode");
  }
  const shifted = n + OFFSET;
  return shifted.toString(36); // compact, mixed alphanumeric slug
}

export function decodeProofSlug(slug: string): bigint | null {
  if (!slug) return null;
  const shifted = parseInt(slug, 36);
  if (!Number.isSafeInteger(shifted)) return null;
  if (shifted < OFFSET) return null;
  const original = shifted - OFFSET;
  return BigInt(original);
}



