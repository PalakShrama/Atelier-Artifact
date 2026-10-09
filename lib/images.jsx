import { urlFor } from './sanity';

// One place that turns any image shape into a plain URL string:
//  - item.imageUrl        (a direct link, e.g. Unsplash)
//  - item.image           (a Sanity image)
//  - item.images[0]       (first Sanity gallery image)
// Returns '' when there is nothing usable.
export function resolveImage(item) {
  if (!item) return '';
  if (typeof item.imageUrl === 'string' && item.imageUrl) return item.imageUrl;
  const src = item.image || item.images?.[0];
  if (!src) return '';
  if (typeof src === 'string') return src;
  try {
    const out = urlFor(src);
    return typeof out === 'string' ? out : out?.url?.() || '';
  } catch {
    return '';
  }
}
