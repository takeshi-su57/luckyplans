// .pnpmfile.cjs
// pnpm.overrides in package.json are NOT applied by `pnpm deploy`.
// This readPackage hook patches vulnerable transitive deps at resolution time,
// which works for both regular installs AND `pnpm deploy`.
function readPackage(pkg) {
  if (pkg.dependencies?.minimatch) {
    pkg.dependencies.minimatch = '>=10.2.3';
  }
  if (pkg.dependencies?.tar) {
    pkg.dependencies.tar = '>=7.5.11';
  }
  if (pkg.dependencies?.multer) {
    pkg.dependencies.multer = '>=2.2.0';
  }
  if (pkg.dependencies?.['serialize-javascript']) {
    pkg.dependencies['serialize-javascript'] = '>=7.0.3';
  }
  if (pkg.dependencies?.ws && ['@nestjs/graphql', 'graphql-ws'].includes(pkg.name)) {
    pkg.dependencies.ws = '>=8.21.0';
  }
  if (pkg.dependencies?.['js-yaml'] && pkg.name === 'gray-matter') {
    pkg.dependencies['js-yaml'] = '>=4.2.0';
  }
  if (pkg.dependencies?.postcss && pkg.name === 'next') {
    pkg.dependencies.postcss = '>=8.5.10';
  }
  if (pkg.dependencies?.uuid && pkg.name === 'sockjs') {
    pkg.dependencies.uuid = '>=11.1.1';
  }
  return pkg;
}

module.exports = { hooks: { readPackage } };
