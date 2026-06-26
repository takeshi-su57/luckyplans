import { describe, expect, it } from 'vitest';
import config from './docusaurus.config';

describe('docs docusaurus config', () => {
  it('serves docs from the site root and blog from /blog', () => {
    const presets = config.presets ?? [];
    const classicPreset = presets.find(
      (preset): preset is [string, Record<string, unknown>] =>
        Array.isArray(preset) && preset[0] === 'classic',
    );

    expect(classicPreset).toBeTruthy();
    expect(config.baseUrl).toBe('/');
    expect(config.url).toBe('https://docs.luckyplans.xyz');
    expect(classicPreset?.[1]?.docs).toMatchObject({
      routeBasePath: '/',
    });
    expect(classicPreset?.[1]?.blog).toMatchObject({
      routeBasePath: 'blog',
    });
  });
});
