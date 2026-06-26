import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import config from './docusaurus.config';

describe('docs docusaurus config', () => {
  it('serves docs from the site root and blog from /blog', () => {
    const presets = config.presets ?? [];
    const classicPreset = presets.find(
      (preset) => Array.isArray(preset) && preset[0] === 'classic',
    );
    const classicPresetOptions =
      Array.isArray(classicPreset) &&
      typeof classicPreset[1] === 'object' &&
      classicPreset[1] !== null
        ? (classicPreset[1] as { docs?: unknown; blog?: unknown })
        : undefined;

    expect(classicPreset).toBeTruthy();
    expect(config.baseUrl).toBe('/');
    expect(config.url).toBe('https://docs.luckyplans.xyz');
    expect(classicPresetOptions?.docs).toMatchObject({
      routeBasePath: '/',
    });
    expect(classicPresetOptions?.blog).toMatchObject({
      routeBasePath: 'blog',
    });
  });

  it('keeps the express 4 path-to-regexp resolution compatible with webpack-dev-server', () => {
    const webpackDevServerRequire = createRequire(
      require.resolve('webpack-dev-server/package.json'),
    );
    const expressPackagePath = webpackDevServerRequire.resolve('express/package.json');
    const expressRequire = createRequire(expressPackagePath);
    const pathToRegexp = expressRequire('path-to-regexp');

    expect(typeof pathToRegexp).toBe('function');
  });
});
