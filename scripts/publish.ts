#!/usr/bin/env bun

const [packageName, versionBump = 'patch'] = process.argv.slice(2);

if (!packageName) {
  console.error('Usage: bun run publish.ts <package-name> [version-bump]');
  process.exit(1);
}

// Find package directory
const packageDir = `packages/${packageName.split('/').pop()}`;

try {
  // Read current version
  const pkgJsonPath = `${packageDir}/package.json`;
  const pkg = await Bun.file(pkgJsonPath).json();
  
  console.log(`Publishing ${packageName} from ${packageDir}...`);
  
  // Bump version
  const { stdout: newVersion } = Bun.spawnSync({
    cmd: ['npm', 'version', versionBump, '--no-git-tag-version'],
    cwd: packageDir,
  });
  
  console.log(`New version: ${newVersion.toString().trim()}`);
  
  // Build package
  console.log('Building package...');
  await Bun.$`bun run build`.cwd(packageDir);
  
  // Publish to npm
  console.log('Publishing to npm...');
  await Bun.$`npm publish --access public`.cwd(packageDir);
  
  // Commit and tag
  await Bun.$`git add ${pkgJsonPath}`;
  await Bun.$`git commit -m "chore: release ${packageName}@${newVersion.toString().trim()}"`;
  await Bun.$`git tag ${packageName}@${newVersion.toString().trim()}`;
  await Bun.$`git push origin main --tags`;
  
  console.log(`✅ Successfully published ${packageName}@${newVersion.toString().trim()}`);
  
} catch (error) {
  console.error('❌ Publishing failed:', error);
  process.exit(1);
}
