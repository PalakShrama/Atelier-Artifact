import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '1i0crqay',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Set to false so fresh dataset updates reflect immediately
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  if (!source) return '/placeholder.jpg';
  
  // If the source is already a full image URL string (e.g. Unsplash), return it as is
  if (typeof source === 'string') {
    return source;
  }
  
  // Otherwise build the URL from the Sanity asset reference
  try {
    return builder.image(source).url();
  } catch (error) {
    console.error('urlFor conversion error:', error);
    return '/placeholder.jpg';
  }
}