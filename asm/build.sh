#!/bin/bash

# ==============================================================================
# Quick Build Script for Spelling Bee - Assembly Edition
# ==============================================================================

set -e  # Exit on error

echo "🐝 Spelling Bee - Assembly Edition Build Script"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "Makefile" ]; then
    echo "Error: Must run from asm/ directory"
    exit 1
fi

# Check dependencies
echo "Checking dependencies..."

if ! command -v nasm &> /dev/null; then
    echo "❌ NASM not found"
    echo "   Install with: sudo apt-get install nasm"
    exit 1
fi
echo "✓ NASM found: $(nasm -version | head -n1)"

if ! command -v sdl2-config &> /dev/null; then
    echo "❌ SDL2 not found"
    echo "   Install with: sudo apt-get install libsdl2-dev"
    exit 1
fi
echo "✓ SDL2 found: $(sdl2-config --version)"

if ! command -v ld &> /dev/null; then
    echo "❌ GNU ld not found"
    exit 1
fi
echo "✓ GNU ld found: $(ld --version | head -n1)"

echo ""
echo "Building..."
make clean
make

echo ""
echo "================================================"
echo "✅ Build complete!"
echo ""
echo "Binary location: build/bee-game"
echo "Binary size: $(du -h build/bee-game | cut -f1)"
echo ""
echo "To run: ./build/bee-game"
echo "        or: make run"
echo ""

# Check for UPX
if command -v upx &> /dev/null; then
    echo "💡 Tip: Run 'make tiny' to create a size-optimized version"
fi
