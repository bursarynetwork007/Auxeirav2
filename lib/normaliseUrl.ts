/**
 * Ensures a URL string has a protocol prefix.
 * Accepts: "auxeira.com", "www.auxeira.com", "https://auxeira.com", "http://auxeira.com"
 * Returns: always "https://..." (or "http://..." if explicitly provided)
 * Returns empty string if input is empty/whitespace.
 */
export function normaliseUrl(raw: string | undefined | null): string {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
