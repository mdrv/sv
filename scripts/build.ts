#!/usr/bin/env bun

// Build all packages or specific package
const [targetPackage] = process.argv.slice(2)

async function buildPackage(packageDir: string) {
	console.log(`📦 Building ${packageDir}...`)

	try {
		await Bun.$`bun run build`.cwd(packageDir)
		console.log(`✅ Built ${packageDir}`)
	} catch (error) {
		console.error(`❌ Failed to build ${packageDir}:`, error)
		process.exit(1)
	}
}

async function buildAll() {
	const packages = ['packages/force-ratio', 'packages/flexible-cards']

	for (const pkg of packages) {
		await buildPackage(pkg)
	}
}

if (targetPackage) {
	const packageDir = `packages/${targetPackage}`
	await buildPackage(packageDir)
} else {
	await buildAll()
}
