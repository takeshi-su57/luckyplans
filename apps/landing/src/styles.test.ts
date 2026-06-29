import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('landing stylesheet cascade', () => {
  it('keeps Tailwind utilities after app and HeroUI defaults without forced heading utilities', () => {
    const stylesPath = resolve(__dirname, 'styles.css');
    const heroPath = resolve(__dirname, 'components/landing/HeroSection.tsx');

    const styles = readFileSync(stylesPath, 'utf8');
    const heroSection = readFileSync(heroPath, 'utf8');
    const layerOrder = styles.indexOf('@layer theme, base, components, utilities;');
    const heroUiImport = styles.indexOf("@import '@heroui/styles/css';");
    const appBaseLayer = styles.indexOf('@layer base');
    const headingDefaults = styles.indexOf(':where(h1, h2, h3, h4, h5, h6)');
    const utilitiesImport = styles.indexOf("@import 'tailwindcss/utilities.css';");

    expect(styles).toContain('@layer theme, base, components, utilities;');
    expect(styles).not.toContain("@import 'tailwindcss';");
    expect(layerOrder).toBe(0);
    expect(heroUiImport).toBeGreaterThan(-1);
    expect(utilitiesImport).toBeGreaterThan(heroUiImport);
    expect(utilitiesImport).toBeLessThan(appBaseLayer);
    expect(appBaseLayer).toBeGreaterThan(-1);
    expect(headingDefaults).toBeGreaterThan(appBaseLayer);
    expect(heroSection).not.toContain('text-5xl!');
  });
});
