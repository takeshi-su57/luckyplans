export type EdgeAgentLogValue = string | number | boolean | null | undefined;
export type EdgeAgentLogMetadata = Record<string, EdgeAgentLogValue>;

export type EdgeAgentLogger = {
  info: (event: string, metadata?: EdgeAgentLogMetadata) => void;
  warn: (event: string, metadata?: EdgeAgentLogMetadata) => void;
  error: (event: string, metadata?: EdgeAgentLogMetadata) => void;
};

export const edgeAgentLogger: EdgeAgentLogger = {
  info: (event, metadata) =>
    writeLog((message) => process.stdout.write(`${message}\n`), event, metadata),
  warn: (event, metadata) => writeLog(console.warn, event, metadata),
  error: (event, metadata) => writeLog(console.error, event, metadata),
};

export function getErrorType(error: unknown): string {
  if (error instanceof Error) {
    return error.name || 'Error';
  }
  return typeof error;
}

function writeLog(
  writer: (message: string) => void,
  event: string,
  metadata: EdgeAgentLogMetadata = {},
) {
  const fields = Object.entries(metadata)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${sanitizeLogValue(value)}`);
  const suffix = fields.length > 0 ? ` ${fields.join(' ')}` : '';
  writer(`[edge-agent] ${event}${suffix}`);
}

function sanitizeLogValue(value: EdgeAgentLogValue): string {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'string') {
    return value.replace(/\s+/g, '_').slice(0, 200);
  }
  return String(value);
}
