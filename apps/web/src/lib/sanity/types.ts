import type { PortableTextBlock } from '@portabletext/react';

export interface SanityImage {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  alt?: string;
}

export interface Author {
  name: string;
  image?: SanityImage;
  bio?: string;
}

export interface Category {
  title: string;
  slug: { current: string };
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: SanityImage;
  body?: PortableTextBlock[]; // Portable Text blocks
  publishedAt: string;
  author?: Author;
  categories?: Category[];
}
