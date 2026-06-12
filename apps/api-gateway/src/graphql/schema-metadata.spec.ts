import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const srcRoot = join(process.cwd(), 'src');
const implicitFieldPatterns = [/@Field\(\s*\)/, /@Field\(\s*\{\s*nullable:\s*true\s*\}\s*\)/];

function getTypeScriptFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return getTypeScriptFiles(fullPath);
    }

    return fullPath.endsWith('.ts') && !fullPath.endsWith('.spec.ts') ? [fullPath] : [];
  });
}

describe('gateway GraphQL schema metadata', () => {
  it('declares explicit field types for scalar GraphQL fields', () => {
    const violations = getTypeScriptFiles(srcRoot).flatMap((file) =>
      readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .flatMap((line, index) =>
          implicitFieldPatterns.some((pattern) => pattern.test(line))
            ? [`${relative(process.cwd(), file)}:${index + 1}: ${line.trim()}`]
            : [],
        ),
    );

    expect(violations).toEqual([]);
  });
});
