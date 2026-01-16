; ==============================================================================
; Game Constants
; ==============================================================================

; Game Configuration
%define MAX_WORD_LENGTH      32
%define MAX_FOUND_WORDS      200
%define MAX_VALID_WORDS      2000
%define MIN_WORD_LENGTH      4
%define MAX_LETTERS          7
%define CENTER_LETTER_IDX    0
%define OUTER_LETTERS_COUNT  6

; Scores
%define SCORE_FOUR_LETTER    1
%define SCORE_PER_LETTER     1
%define PANGRAM_BONUS        7

; Display Constants
%define WINDOW_WIDTH         800
%define WINDOW_HEIGHT        1200
%define HEX_SIZE            60
%define HEX_CENTER_X         400
%define HEX_CENTER_Y         500

; Message Types
%define MSG_NONE             0
%define MSG_SUCCESS          1
%define MSG_ERROR            2
%define MSG_INFO             3

; Message Duration (frames at 60 FPS)
%define MESSAGE_DURATION     180    ; 3 seconds

; Ranks (score percentage thresholds)
%define RANK_BEGINNER        0      ; 0%
%define RANK_GOOD_START      2      ; 2%
%define RANK_MOVING_UP       5      ; 5%
%define RANK_GOOD            8      ; 8%
%define RANK_SOLID           15     ; 15%
%define RANK_NICE            25     ; 25%
%define RANK_GREAT           40     ; 40%
%define RANK_AMAZING         50     ; 50%
%define RANK_GENIUS          70     ; 70%
%define RANK_QUEEN_BEE       100    ; 100%

; Frame Rate
%define TARGET_FPS           60
%define FRAME_DELAY          16     ; milliseconds (1000/60)

; Animation
%define ANIM_HEXAGON_PRESS   80     ; milliseconds
%define ANIM_LETTER_ENTRY    150    ; milliseconds
%define ANIM_SHUFFLE         300    ; milliseconds

; Buffer Sizes
%define INPUT_BUFFER_SIZE    256
%define TEMP_BUFFER_SIZE     1024
%define RENDER_BUFFER_SIZE   4096
