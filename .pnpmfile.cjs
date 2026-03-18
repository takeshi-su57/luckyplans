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
  return pkg;
}

module.exports = { hooks: { readPackage } };
