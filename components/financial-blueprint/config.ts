/**
 * Financial Base Blueprint — landing page config
 * Update ORDER_PAGE_URL when your checkout / order page is live.
 */

/** Replace with your real order / checkout URL. */
export const ORDER_PAGE_URL =
  "https://join.saccofinancial.com/f4c92a71";

export const PRODUCT_NAME = "The Financial Base Blueprint";

/**
 * Sales video embed (YouTube or Vimeo). Paste the embed URL only — not the watch page.
 * YouTube: Share → Embed → copy src, e.g. https://www.youtube.com/embed/VIDEO_ID
 * Vimeo: Share → Embed → copy src from the iframe
 * Leave null to keep the “video coming soon” placeholder in VideoSalesSection.
 */
export const SALES_VIDEO_EMBED_URL: string | null =
  "https://www.youtube.com/embed/FVwjMZ6Ai-s?si=gib8gTynilXdpKXw";

export const FOUNDING_PRICE = 29;

export const ANCHOR_PRICE = 79;

/**
 * When your cover image is in /public, set this path and the hero will use it.
 * Example: "/images/financial-base-blueprint-cover.png"
 */
export const COVER_IMAGE_PATH: string | null = "/Financial Base Cover Image.jpg";
