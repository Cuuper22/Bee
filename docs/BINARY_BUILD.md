# Binary Executable Build Guide

This document explains how to build and distribute the Bee Server as a standalone binary executable.

## Overview

The Bee Server can be compiled into a single, self-contained binary executable that:

- ✅ **Requires no Node.js installation** - Includes embedded Node.js runtime
- ✅ **Requires no compilation** - Ready to run immediately
- ✅ **Requires no dependencies** - All code bundled into single file
- ✅ **Fast startup** - Optimized with esbuild and V8 code cache
- ✅ **Production ready** - Same code as source version

## Quick Start

```bash
# Build binary for current platform
npm run build:binary

# Run the binary
./build/bee-server-linux-x64
```

## Technology Stack

- **Node.js SEA** - Single Executable Application (native Node.js feature)
- **esbuild** - Ultra-fast bundler for optimizing code
- **postject** - Binary injection tool

## Building

```bash
npm run build:binary
```

Output: `build/bee-server-{platform}-{arch}`

## Running

### Linux / macOS
```bash
chmod +x build/bee-server-linux-x64
./build/bee-server-linux-x64
```

### Windows
```cmd
build\bee-server-windows-x64.exe
```

## Configuration

Use environment variables or `.env` file:
```env
PORT=3000
NODE_ENV=production
```

For complete documentation, see [BINARY_BUILD_COMPLETE.md](./BINARY_BUILD_COMPLETE.md)
