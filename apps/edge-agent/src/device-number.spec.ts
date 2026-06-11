import { describe, expect, it } from 'vitest';
import { buildDeviceNumber } from './device-number';

describe('buildDeviceNumber', () => {
  it('builds edge-<slug>-<shortid> format', () => {
    const value = buildDeviceNumber('test Lab', () => 'a7k29f');
    expect(value).toBe('edge-test-lab-a7k29f');
  });
});
