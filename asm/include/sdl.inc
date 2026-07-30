; ==============================================================================
; SDL2 Constants
; ==============================================================================

; SDL Init Flags
%define SDL_INIT_VIDEO           0x00000020
%define SDL_INIT_AUDIO           0x00000010
%define SDL_INIT_EVENTS          0x00004000

; Window Flags
%define SDL_WINDOW_SHOWN         0x00000004
%define SDL_WINDOW_HIDDEN        0x00000008
%define SDL_WINDOW_RESIZABLE     0x00000020
%define SDL_WINDOW_MAXIMIZED     0x00000080
%define SDL_WINDOW_FULLSCREEN    0x00000001

; Window Position
%define SDL_WINDOWPOS_CENTERED   0x2FFF0000

; Renderer Flags
%define SDL_RENDERER_SOFTWARE      0x00000001
%define SDL_RENDERER_ACCELERATED   0x00000002
%define SDL_RENDERER_PRESENTVSYNC  0x00000004

; Event Types
%define SDL_QUIT                 0x100
%define SDL_KEYDOWN              0x300
%define SDL_KEYUP                0x301
%define SDL_MOUSEBUTTONDOWN      0x401
%define SDL_MOUSEBUTTONUP        0x402
%define SDL_MOUSEMOTION          0x400

; Key Codes
%define SDLK_RETURN     0x0D
%define SDLK_ESCAPE     0x1B
%define SDLK_BACKSPACE  0x08
%define SDLK_TAB        0x09
%define SDLK_SPACE      0x20
%define SDLK_DELETE     0x7F

; Blend Modes
%define SDL_BLENDMODE_NONE    0x00000000
%define SDL_BLENDMODE_BLEND   0x00000001
%define SDL_BLENDMODE_ADD     0x00000002
%define SDL_BLENDMODE_MOD     0x00000004
