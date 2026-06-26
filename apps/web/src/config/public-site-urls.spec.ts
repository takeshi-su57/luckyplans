import { describe, expect, it } from 'vitest';
import { resolveBlogUrl, resolveDocsUrl } from './public-site-urls';

describe('public site urls', () => {
  it('uses explicit NEXT_PUBLIC_DOCS_URL when provided', () => {
    expect(
      resolveDocsUrl({
        NEXT_PUBLIC_DOCS_URL: 'https://docs.preview.example',
        NODE_ENV: 'production',
      }),
    ).toBe('https://docs.preview.example');
  });

  it('defaults to the docs subdomain in production', () => {
    expect(
      resolveDocsUrl({
        NODE_ENV: 'production',
      }),
    ).toBe('https://docs.luckyplans.xyz');
  });

  it('defaults to the local docs path outside production', () => {
    expect(
      resolveDocsUrl({
        NODE_ENV: 'development',
      }),
    ).toBe('/docs');
  });

  it('derives the blog url from the docs base url', () => {
    expect(
      resolveBlogUrl({
        NEXT_PUBLIC_DOCS_URL: 'https://docs.luckyplans.xyz',
        NODE_ENV: 'production',
      }),
    ).toBe('https://docs.luckyplans.xyz/blog');
  });
});
