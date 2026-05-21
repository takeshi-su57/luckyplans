export function buildDeviceNumber(name: string, shortIdFactory: () => string): string {
  const slug =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'edge';

  return `edge-${slug}-${shortIdFactory()}`;
}
