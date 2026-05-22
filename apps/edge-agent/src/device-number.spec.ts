import { describe, expect, it } from 'vitest';
import { buildDeviceNumber } from './device-number';

describe('buildDeviceNumber', () => {
  it('builds edge-<slug>-<shortid> format', () => {
    const value = buildDeviceNumber('Seoul Lab', () => 'a7k29f');
    expect(value).toBe('edge-seoul-lab-a7k29f');
  });
});
