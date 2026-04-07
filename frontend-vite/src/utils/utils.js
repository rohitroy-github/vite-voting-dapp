/**
 * Shortens an Ethereum address for display.
 * e.g. "0x1234567890abcdef...ef123"
 * @param {string} address - Full hex address
 * @param {number} prefixLen - Characters to keep after "0x" (default 6)
 * @param {number} suffixLen - Trailing characters to keep (default 4)
 * @returns {string}
 */
export function shortenAddress(address, prefixLen = 5, suffixLen = 5) {
  if (!address) return "";
  return `${address.slice(0, prefixLen + 2)}...${address.slice(-suffixLen)}`;
}
