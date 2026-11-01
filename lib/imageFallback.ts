export const FALLBACK_PRODUCT_IMAGE = '/images/fallback_product.svg';
export const SECONDARY_FALLBACK_IMAGE = '/images/hero_store.jpg';

/**
 * Returns a normalized, valid image path or falls back to standard placeholder
 */
export function getValidImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return FALLBACK_PRODUCT_IMAGE;
  }
  const clean = url.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/')) {
    return clean;
  }
  return `/${clean}`;
}
