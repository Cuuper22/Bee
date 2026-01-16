; ==============================================================================
; System Call Numbers for Linux x86-64
; ==============================================================================

%define SYS_READ     0
%define SYS_WRITE    1
%define SYS_OPEN     2
%define SYS_CLOSE    3
%define SYS_STAT     4
%define SYS_FSTAT    5
%define SYS_MMAP     9
%define SYS_MUNMAP   11
%define SYS_EXIT     60
%define SYS_GETPID   39

; File descriptors
%define STDIN   0
%define STDOUT  1
%define STDERR  2

; Open flags
%define O_RDONLY   0x0000
%define O_WRONLY   0x0001
%define O_RDWR     0x0002
%define O_CREAT    0x0040
%define O_TRUNC    0x0200

; File permissions
%define S_IRUSR    0x0100
%define S_IWUSR    0x0080
%define S_IRGRP    0x0020
%define S_IROTH    0x0004
