const DEFAULT_SITE_URL = "https://saccofinancial.com";

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Canonical site origin. Set `NEXT_PUBLIC_SITE_URL` in preview/staging so
 * metadata, sitemap, and JSON-LD match the deployed host.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return normalizeSiteUrl(raw);
  return DEFAULT_SITE_URL;
}

/**
 * Absolute URL for a site path (leading slash optional). Uses the URL API so
 * paths with spaces or special characters are encoded correctly.
 */
export function absoluteUrl(path: string): string {
  const base = `${normalizeSiteUrl(getSiteUrl())}/`;
  const pathPart = path.startsWith("/") ? path : `/${path}`;
  return new URL(pathPart, base).href;
}

/** Open Graph / Twitter / default Person portrait (resolved via `metadataBase`). */
export const defaultOgImagePath = "/images/profile.jpg";
