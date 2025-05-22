/**
 * Generate a unique key for location entries
 */
export function generateKey(): string {
  // Simplified timestamp-based key generation
  return Date.now().toString(36);
}
