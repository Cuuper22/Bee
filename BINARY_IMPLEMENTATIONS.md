# Binary Executable Implementations - Spelling Bee Game

This document explains the two binary executable implementations available for the Bee game.

## Two Approaches to "Write Out Binary Executable"

### 1. Node.js SEA Binary (Server) ✅ **WINDOWS VERIFIED**

**Location**: Root directory (`scripts/build-binary.mjs`)

**What it is**: The Node.js backend server bundled into a single executable binary using Node.js Single Executable Application (SEA) technology.

**Purpose**: Distribute the backend server without requiring Node.js installation or npm dependencies.

**Size**: 90.93 MB in the current Windows verification; 93.25 MB in the earlier recorded build

**Usage**:
```bash
# Build
npm run build:binary

# Run
./build/bee-server-linux-x64
```

**Documentation**: [docs/BINARY_BUILD.md](docs/BINARY_BUILD.md)

---

### 2. Pure Assembly Game (Client) ⚠️ **PROTOTYPE**

**Location**: `asm/` directory

**What it is**: A partial Spelling Bee game implementation in pure x86-64 assembly language.

**Purpose**: Demonstrate the extreme edge of what's technically possible - the lightest, fastest, most optimized version possible.

**Size**: ~12 KB (7,771x smaller than the documented Node.js build)

**Performance**: Startup, memory, and frame-rate claims have not been re-measured. The current source still has TODOs for text rendering, complete shapes, and click hit-testing.

**Usage**:
```bash
cd asm
./build.sh
./build/bee-game
```

**Documentation**: [asm/README.md](asm/README.md)

---

## Comparison

| Feature | Node.js SEA | Assembly |
|---------|-------------|----------|
| **Type** | Backend Server | Game Prototype |
| **Language** | TypeScript/JavaScript | x86-64 Assembly |
| **Size** | 90.93-93.25 MB recorded | ~12 KB documented |
| **Startup** | Not re-measured | Not re-measured |
| **Memory** | Not re-measured | Not re-measured |
| **Platform** | Cross-platform | Linux x86-64 |
| **Dependencies** | None (embedded runtime) | SDL2 only |
| **Purpose** | Server distribution after target testing | Optimization prototype |
| **Level** | Professional | Expert/Extreme |

---

## Which One Should You Use?

### Use Node.js SEA if:
- ✅ You need to distribute the backend server
- ✅ You want cross-platform support (Linux, macOS, Windows)
- ✅ You can build and test on the target platform
- ✅ You want a self-contained server executable

### Use Assembly version if:
- ✅ You want the absolute smallest possible binary
- ✅ You need maximum performance
- ✅ You're exploring technical boundaries
- ✅ You're learning low-level programming
- ✅ You want to understand how games work at the metal

---

## Technical Achievement

This project demonstrates **both extremes**:

1. **Modern High-Level** (Node.js SEA)
   - Modern JavaScript/TypeScript
   - Full-featured backend with tRPC, Express, OAuth
   - Professional packaging for distribution
   - Industry-standard approach

2. **Extreme Low-Level** (Assembly)
   - Direct CPU instructions
   - Manual memory management
   - Hardware-accelerated graphics (SDL2)
   - Every byte optimized
   - Pushing the boundaries of what's possible

Together, they show the full spectrum from "practical production use" to "technically extreme demonstration."

---

## Building Both

```bash
# Build Node.js SEA binary
npm run build:binary

# Build Assembly game
cd asm && ./build.sh

# Results
ls -lh build/bee-server-linux-x64    # 93.25 MB in the documented build
ls -lh asm/build/bee-game             # ~12 KB in the documented build
```

## Running Both

```bash
# Run Node.js server
./build/bee-server-linux-x64
# Server starts on http://localhost:3000

# Run Assembly game  
./asm/build/bee-game
# Requires SDL2; runtime was not revalidated
```

---

## Future Possibilities

### Assembly Version
- [ ] Even smaller (target: <5 KB)
- [ ] Bare metal version (no OS)
- [ ] ARM64/RISC-V ports
- [ ] SIMD optimizations
- [ ] Networked multiplayer

### Node.js SEA Version
- [ ] Cross-compilation for all platforms
- [ ] Desktop app with Electron alternative
- [ ] Even smaller bundle (custom Node.js build)
- [ ] Additional optimizations

---

**Built by an expert computer scientist exploring the edge of what's technically possible** 🚀

*"From 93.25 MB to ~12 KB in the documented build"*
