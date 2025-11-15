#!/usr/bin/env bun

const [packageName, versionBump = 'patch'] = process.argv.slice(2)

if (!packageName) {
	console.error('Usage: bun run publish.ts <package-name> [version-bump]')
	console.error('Example: bun run publish.ts @myorg/core minor')
	process.exit(1)
}

// Extract package directory name from package name
const packageDirName = packageName.split('/').pop()
const packageDir = `packages/${packageDirName}`

try {
	// Verify package exists
	const pkgJsonPath = `${packageDir}/package.json`
	const pkgExists = await Bun.file(pkgJsonPath).exists()

	if (!pkgExists) {
		console.error(`❌ Package directory not found: ${packageDir}`)
		process.exit(1)
	}

	// Build the specific package
	console.log('🔨 Building package...')
	await Bun.$`bun run build`.cwd(packageDir)

	// Custom version bumping (Bun-only)
	console.log(`📈 Bumping version (${versionBump})...`)
	const pkg = await Bun.file(pkgJsonPath).json()
	const [major, minor, patch] = pkg.version.split('.').map(Number)

	let newVersion: string
	switch (versionBump) {
		case 'major':
			newVersion = `${major + 1}.0.0`
			break
		case 'minor':
			newVersion = `${major}.${minor + 1}.0`
			break
		case 'patch':
			newVersion = `${major}.${minor}.${patch + 1}`
			break
		default:
			newVersion = pkg.version
	}

	pkg.version = newVersion
	await Bun.write(pkgJsonPath, JSON.stringify(pkg, null, 2) + '\n')
	console.log(`🎯 New version: ${newVersion}`)

	// Read updated package.json
	const updatedPkg = await Bun.file(pkgJsonPath).json()

	// Publish to npm
	console.log('📤 Publishing to npm...')
	await Bun.$`npm publish --access public`.cwd(packageDir)

	// Git operations
	console.log('🔖 Creating git tag and commit...')
	await Bun.$`git add ${pkgJsonPath}`
	await Bun.$`git commit -m "chore: release ${packageName}@${updatedPkg.version}"`
	await Bun.$`git tag "${packageName}@${updatedPkg.version}"`
	await Bun.$`git push origin main`
	await Bun.$`git push origin "${packageName}@${updatedPkg.version}"`

	console.log(`✅ Successfully published ${packageName}@${updatedPkg.version}`)
} catch (error) {
	console.error('❌ Publishing failed:', error)
	process.exit(1)
}
