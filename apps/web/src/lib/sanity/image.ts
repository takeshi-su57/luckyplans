import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url';
import { getSanityClient } from './client';

export function urlFor(source: SanityImageSource) {
  const client = getSanityClient();
  if (!client) throw new Error('Sanity client not configured');
  return imageUrlBuilder(client).image(source);
}
