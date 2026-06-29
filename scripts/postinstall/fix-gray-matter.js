const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'node_modules');

function findGrayMatterEngines(dir, results) {
  let entries = [];

  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.name === 'gray-matter') {
      const enginesPath = path.join(fullPath, 'lib', 'engines.js');
      if (fs.existsSync(enginesPath)) {
        results.push(enginesPath);
      }
      continue;
    }

    // pnpm stores real package contents under node_modules/.pnpm/**/node_modules.
    if (entry.name === '.pnpm' || entry.name === 'node_modules' || entry.name.includes('gray-matter')) {
      findGrayMatterEngines(fullPath, results);
    }
  }
}

function patchGrayMatter(enginesPath) {
  const original = fs.readFileSync(enginesPath, 'utf8');
  const patched = original
    .replaceAll('yaml.safeLoad.bind(yaml)', 'yaml.load.bind(yaml)')
    .replaceAll('yaml.safeDump.bind(yaml)', 'yaml.dump.bind(yaml)');

  if (patched !== original) {
    try {
      fs.chmodSync(enginesPath, 0o666);
      fs.writeFileSync(enginesPath, patched, 'utf8');
      return true;
    } catch (error) {
      console.warn(`Could not patch ${enginesPath}: ${error.message}`);
    }
  }

  return false;
}

if (!fs.existsSync(root)) {
  process.exit(0);
}

const enginesFiles = [];
findGrayMatterEngines(root, enginesFiles);

let patchedCount = 0;
for (const enginesPath of enginesFiles) {
  if (patchGrayMatter(enginesPath)) {
    patchedCount += 1;
  }
}

if (patchedCount > 0) {
  console.log(`Patched gray-matter compatibility in ${patchedCount} file(s).`);
}
