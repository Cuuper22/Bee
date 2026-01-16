#!/usr/bin/env node

/**
 * Binary Executable Builder for Bee Server
 * 
 * This script creates standalone binary executables for the Bee server
 * that can run without requiring Node.js installation or source compilation.
 * 
 * Uses Node.js Single Executable Application (SEA) feature with:
 * - esbuild for bundling TypeScript to optimized JavaScript
 * - Node.js SEA for creating self-contained executables
 * - postject for binary injection
 * 
 * Supports: Linux (x64, arm64), macOS (x64, arm64), Windows (x64)
 */

import { execSync } from 'child_process';
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync, rmSync, chmodSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '..');
const BUILD_DIR = join(ROOT_DIR, 'build');
const DIST_DIR = join(ROOT_DIR, 'dist');

// SEA sentinel fuse (required by postject)
const SEA_SENTINEL_FUSE = 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2';

// Color console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function step(message) {
  log(`\n▶ ${message}`, colors.cyan + colors.bright);
}

function success(message) {
  log(`✓ ${message}`, colors.green);
}

function error(message) {
  log(`✗ ${message}`, colors.red);
}

function exec(command, options = {}) {
  try {
    const result = execSync(command, {
      cwd: ROOT_DIR,
      stdio: 'pipe',
      encoding: 'utf-8',
      ...options
    });
    return result;
  } catch (err) {
    error(`Command failed: ${command}`);
    console.error(err.stdout || err.message);
    throw err;
  }
}

// Platform configurations
const PLATFORMS = {
  'linux-x64': {
    nodeBinary: process.platform === 'linux' && process.arch === 'x64' ? process.execPath : null,
    outputName: 'bee-server-linux-x64',
    canBuild: process.platform === 'linux',
  },
  'linux-arm64': {
    nodeBinary: process.platform === 'linux' && process.arch === 'arm64' ? process.execPath : null,
    outputName: 'bee-server-linux-arm64',
    canBuild: process.platform === 'linux',
  },
  'darwin-x64': {
    nodeBinary: process.platform === 'darwin' && process.arch === 'x64' ? process.execPath : null,
    outputName: 'bee-server-macos-x64',
    canBuild: process.platform === 'darwin',
  },
  'darwin-arm64': {
    nodeBinary: process.platform === 'darwin' && process.arch === 'arm64' ? process.execPath : null,
    outputName: 'bee-server-macos-arm64',
    canBuild: process.platform === 'darwin',
  },
  'win32-x64': {
    nodeBinary: process.platform === 'win32' && process.arch === 'x64' ? process.execPath : null,
    outputName: 'bee-server-windows-x64.exe',
    canBuild: process.platform === 'win32',
  },
};

function cleanBuildDir() {
  step('Cleaning build directory');
  if (existsSync(BUILD_DIR)) {
    rmSync(BUILD_DIR, { recursive: true, force: true });
  }
  mkdirSync(BUILD_DIR, { recursive: true });
  success('Build directory cleaned');
}

function bundleApplication() {
  step('Bundling application with esbuild');
  
  // Ensure dist directory exists
  if (!existsSync(DIST_DIR)) {
    mkdirSync(DIST_DIR, { recursive: true });
  }
  
  // Bundle for SEA (CommonJS format for better compatibility)
  log('Creating SEA-compatible bundle...', colors.blue);
  const esbuildArgs = [
    'server/_core/index.ts',
    '--platform=node',
    '--packages=bundle',
    '--bundle',
    '--format=cjs',
    '--outfile=dist/index.js',
    '--minify',
    '--tree-shaking=true'
  ].join(' ');
  exec(`npx esbuild ${esbuildArgs}`);
  
  success('Application bundled successfully');
  
  // Verify the bundle was created
  const bundlePath = join(DIST_DIR, 'index.js');
  if (!existsSync(bundlePath)) {
    throw new Error('Bundle not created at ' + bundlePath);
  }
  
  // Add a shebang for Unix-like systems
  const bundleContent = readFileSync(bundlePath, 'utf-8');
  if (!bundleContent.startsWith('#!')) {
    const withShebang = '#!/usr/bin/env node\n' + bundleContent;
    writeFileSync(bundlePath, withShebang, 'utf-8');
    log('Added shebang to bundle', colors.blue);
  }
}

function generateSEABlob() {
  step('Generating SEA blob');
  
  const configPath = join(ROOT_DIR, 'sea-config.json');
  if (!existsSync(configPath)) {
    throw new Error('sea-config.json not found');
  }
  
  exec(`node --experimental-sea-config ${configPath}`);
  
  const blobPath = join(ROOT_DIR, 'sea-prep.blob');
  if (!existsSync(blobPath)) {
    throw new Error('SEA blob not generated');
  }
  
  success('SEA blob generated successfully');
  return blobPath;
}

function createBinaryForCurrentPlatform() {
  const platform = process.platform;
  const arch = process.arch;
  const platformKey = `${platform}-${arch}`;
  
  const config = PLATFORMS[platformKey];
  if (!config) {
    error(`Unsupported platform: ${platformKey}`);
    return null;
  }
  
  if (!config.canBuild) {
    error(`Cannot build for ${platformKey} on current platform`);
    return null;
  }
  
  step(`Creating binary for ${platformKey}`);
  
  const nodeBinary = config.nodeBinary || process.execPath;
  const outputPath = join(BUILD_DIR, config.outputName);
  
  // Copy Node.js binary
  log(`Copying Node.js binary from ${nodeBinary}`, colors.blue);
  copyFileSync(nodeBinary, outputPath);
  
  // Make executable on Unix-like systems
  if (platform !== 'win32') {
    chmodSync(outputPath, 0o755);
  }
  
  // Inject SEA blob using postject
  const blobPath = join(ROOT_DIR, 'sea-prep.blob');
  log('Injecting SEA blob into binary', colors.blue);
  
  try {
    if (platform === 'darwin') {
      // macOS requires code signing removal before injection
      exec(`codesign --remove-signature "${outputPath}"`, { stdio: 'ignore' });
      exec(`npx postject "${outputPath}" NODE_SEA_BLOB "${blobPath}" --sentinel-fuse ${SEA_SENTINEL_FUSE} --macho-segment-name NODE_SEA`);
      // Re-sign after injection (ad-hoc signature)
      exec(`codesign --sign - "${outputPath}"`, { stdio: 'ignore' });
    } else if (platform === 'win32') {
      exec(`npx postject "${outputPath}" NODE_SEA_BLOB "${blobPath}" --sentinel-fuse ${SEA_SENTINEL_FUSE}`);
    } else {
      // Linux
      exec(`npx postject "${outputPath}" NODE_SEA_BLOB "${blobPath}" --sentinel-fuse ${SEA_SENTINEL_FUSE}`);
    }
  } catch (err) {
    error(`Failed to inject blob: ${err.message}`);
    throw err;
  }
  
  success(`Binary created: ${outputPath}`);
  
  // Get file size
  const { size } = statSync(outputPath);
  const sizeMB = (size / (1024 * 1024)).toFixed(2);
  log(`Binary size: ${sizeMB} MB`, colors.yellow);
  
  return outputPath;
}

function createReadme() {
  const readmePath = join(BUILD_DIR, 'README.md');
  const content = `# Bee Server - Binary Executable

This directory contains standalone binary executables for the Bee server.

## Usage

### Linux / macOS
\`\`\`bash
# Make executable (if not already)
chmod +x bee-server-*

# Run the server
./bee-server-linux-x64

# Or with custom port
PORT=4000 ./bee-server-linux-x64
\`\`\`

### Windows
\`\`\`cmd
REM Run the server
bee-server-windows-x64.exe

REM Or with custom port
set PORT=4000
bee-server-windows-x64.exe
\`\`\`

## Features

- ✅ **No Node.js Required**: Self-contained executable with embedded Node.js runtime
- ✅ **No Compilation**: Ready to run immediately, no build step needed
- ✅ **Fast Startup**: Optimized bundling with esbuild
- ✅ **Small Size**: Compressed and tree-shaken for minimal footprint
- ✅ **Production Ready**: Same code as npm package, just packaged differently

## Environment Variables

The binary supports all the same environment variables as the source version:

- \`PORT\` - Server port (default: 3000)
- \`NODE_ENV\` - Environment mode (production/development)
- Additional variables from your .env file

Create a \`.env\` file in the same directory as the binary to configure it.

## Technical Details

Built using:
- **Node.js SEA** (Single Executable Application) - Native Node.js feature
- **esbuild** - Ultra-fast JavaScript bundler
- **postject** - Binary injection tool

Platform: ${process.platform}-${process.arch}
Build date: ${new Date().toISOString()}
Node version: ${process.version}

## Support

For issues or questions, visit: https://github.com/Cuuper22/Bee
`;
  
  writeFileSync(readmePath, content, 'utf-8');
  success('README.md created in build directory');
}

function printSummary(binaryPath) {
  log('\n' + '='.repeat(60), colors.bright);
  log('BUILD SUCCESSFUL', colors.green + colors.bright);
  log('='.repeat(60), colors.bright);
  
  if (binaryPath) {
    log(`\nBinary executable created at:`, colors.cyan);
    log(`  ${binaryPath}`, colors.bright);
    
    log(`\nTo run the binary:`, colors.cyan);
    if (process.platform === 'win32') {
      log(`  ${binaryPath}`, colors.bright);
    } else {
      log(`  chmod +x ${binaryPath}`, colors.bright);
      log(`  ${binaryPath}`, colors.bright);
    }
  }
  
  log(`\n📦 All build artifacts are in: ${BUILD_DIR}`, colors.yellow);
  log('');
}

// Main execution
async function main() {
  log('\n🐝 Bee Server - Binary Executable Builder', colors.bright + colors.cyan);
  log('='.repeat(60), colors.cyan);
  
  try {
    // Step 1: Clean
    cleanBuildDir();
    
    // Step 2: Bundle
    bundleApplication();
    
    // Step 3: Generate SEA blob
    generateSEABlob();
    
    // Step 4: Create binary for current platform
    const binaryPath = createBinaryForCurrentPlatform();
    
    // Step 5: Create README
    createReadme();
    
    // Step 6: Print summary
    printSummary(binaryPath);
    
  } catch (err) {
    error('\nBuild failed!');
    console.error(err);
    process.exit(1);
  }
}

main();
