import { describe, expect, it } from 'vitest';
import { createGraphqlOptions } from './app.module';

describe('createGraphqlOptions', () => {
  it('disables playground and introspection in production', () => {
    const options = createGraphqlOptions('production');

    expect(options.playground).toBe(false);
    expect(options.introspection).toBe(false);
  });

  it('keeps playground and introspection enabled outside production', () => {
    const options = createGraphqlOptions('development');

    expect(options.playground).toBe(true);
    expect(options.introspection).toBe(true);
  });
});
