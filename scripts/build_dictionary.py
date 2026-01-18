import json
import re

# Load game words
try:
    with open('assets/words_alpha.txt', 'r') as f:
        game_words = set(line.strip().lower() for line in f)
except FileNotFoundError:
    print("Error: assets/words_alpha.txt not found")
    exit(1)

# Load definitions
try:
    with open('temp_dict.json', 'r') as f:
        definitions_raw = json.load(f)
except FileNotFoundError:
    print("Error: temp_dict.json not found")
    exit(1)

# Process definitions
# The raw dictionary has keys in UPPERCASE.
# We want to create a mapping: word (lower) -> definition
# Only for words that are in game_words.
# Also, clean up definitions if possible.

processed_dict = {}

def clean_definition(text):
    # Remove things like "See X." or "[Obs.]" or multiple spaces
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    # Take first sentence if too long?
    # For now, keep it as is but maybe truncate if extremely long.
    if len(text) > 300:
        parts = text.split('. ')
        if len(parts) > 1:
            return parts[0] + '.'
    return text

count = 0
found_count = 0

for word_upper, definition in definitions_raw.items():
    word_lower = word_upper.lower()

    # We only care if the word is in our game dictionary
    if word_lower in game_words:
        clean_def = clean_definition(definition)
        if clean_def:
            processed_dict[word_lower] = clean_def
            found_count += 1
    count += 1

print(f"Total words in definition source: {count}")
print(f"Words matched with game dictionary: {found_count}")

# Save to assets/dictionary.json
with open('assets/dictionary.json', 'w') as f:
    json.dump(processed_dict, f)

print("Saved assets/dictionary.json")
