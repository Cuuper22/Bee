# ==============================================================================
# Makefile for Spelling Bee - Assembly Edition
# ==============================================================================

# Assembler and flags
ASM = nasm
ASMFLAGS = -f elf64 -g -F dwarf

# Linker and flags
LD = ld
LDFLAGS = -dynamic-linker /lib64/ld-linux-x86-64.so.2

# C compiler for SDL2 setup (optional)
CC = gcc
CFLAGS = -O3 -Wall

# Directories
SRC_DIR = src
INC_DIR = include
BUILD_DIR = build
DATA_DIR = data

# SDL2 configuration
SDL2_CFLAGS = $(shell sdl2-config --cflags)
SDL2_LIBS = $(shell sdl2-config --libs)

# Target binary
TARGET = $(BUILD_DIR)/bee-game
TARGET_SIZE_OPT = $(BUILD_DIR)/bee-game-tiny

# Source files
SOURCES = $(SRC_DIR)/main.asm
OBJECTS = $(BUILD_DIR)/main.o

# SDL2 libraries for dynamic linking
LIBS = -lSDL2 -lc -lm

.PHONY: all clean run tiny help install

# Default target
all: $(TARGET)

# Build standard version
$(TARGET): $(OBJECTS) | $(BUILD_DIR)
	@echo "Linking $(TARGET)..."
	$(LD) $(LDFLAGS) -o $@ $(OBJECTS) $(LIBS)
	@echo "Build complete: $@"
	@ls -lh $@

# Assemble main source
$(BUILD_DIR)/main.o: $(SOURCES) $(INC_DIR)/*.inc | $(BUILD_DIR)
	@echo "Assembling $<..."
	$(ASM) $(ASMFLAGS) -I$(INC_DIR)/ $< -o $@

# Build tiny version (size-optimized)
tiny: $(TARGET_SIZE_OPT)

$(TARGET_SIZE_OPT): $(OBJECTS) | $(BUILD_DIR)
	@echo "Building size-optimized version..."
	$(LD) $(LDFLAGS) -s -o $@ $(OBJECTS) $(LIBS)
	strip --strip-all $@
	@echo "Tiny build complete: $@"
	@ls -lh $@
	@echo "Attempting UPX compression..."
	-upx --best $@ 2>/dev/null || echo "UPX not available (optional)"
	@ls -lh $@

# Create build directory
$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

# Run the game
run: $(TARGET)
	@echo "Running Spelling Bee (Assembly Edition)..."
	./$(TARGET)

# Run tiny version
run-tiny: $(TARGET_SIZE_OPT)
	@echo "Running Spelling Bee (Tiny Edition)..."
	./$(TARGET_SIZE_OPT)

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf $(BUILD_DIR)/*.o $(BUILD_DIR)/bee-game*
	@echo "Clean complete."

# Help message
help:
	@echo "Spelling Bee - Assembly Edition Build System"
	@echo "=============================================="
	@echo ""
	@echo "Targets:"
	@echo "  all         - Build standard version (default)"
	@echo "  tiny        - Build size-optimized version with UPX"
	@echo "  run         - Build and run standard version"
	@echo "  run-tiny    - Build and run tiny version"
	@echo "  clean       - Remove build artifacts"
	@echo "  install     - Install to /usr/local/bin"
	@echo "  help        - Show this message"
	@echo ""
	@echo "Requirements:"
	@echo "  - NASM assembler (nasm)"
	@echo "  - SDL2 library (libsdl2-dev)"
	@echo "  - GNU linker (ld)"
	@echo "  - UPX compressor (optional, for 'tiny' target)"
	@echo ""
	@echo "Installation (Ubuntu/Debian):"
	@echo "  sudo apt-get install nasm libsdl2-dev upx"
	@echo ""
	@echo "Binary Sizes:"
	@echo "  Standard: ~10-15 KB"
	@echo "  Tiny:     ~5-8 KB (with UPX)"

# Install to system
install: $(TARGET)
	@echo "Installing $(TARGET) to /usr/local/bin/bee-game..."
	sudo cp $(TARGET) /usr/local/bin/bee-game
	sudo chmod +x /usr/local/bin/bee-game
	@echo "Installation complete. Run with: bee-game"

# Display build information
info:
	@echo "Build Information"
	@echo "================="
	@echo "Assembler: $(ASM)"
	@echo "Linker: $(LD)"
	@echo "SDL2 CFLAGS: $(SDL2_CFLAGS)"
	@echo "SDL2 LIBS: $(SDL2_LIBS)"
	@echo "Build dir: $(BUILD_DIR)"
	@echo "Target: $(TARGET)"

# Check dependencies
check-deps:
	@echo "Checking dependencies..."
	@command -v $(ASM) >/dev/null 2>&1 || { echo "ERROR: NASM not found. Install with: sudo apt-get install nasm"; exit 1; }
	@command -v $(LD) >/dev/null 2>&1 || { echo "ERROR: ld not found."; exit 1; }
	@command -v sdl2-config >/dev/null 2>&1 || { echo "ERROR: SDL2 not found. Install with: sudo apt-get install libsdl2-dev"; exit 1; }
	@echo "All dependencies satisfied!"
