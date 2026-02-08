# anylist-openclaw-skill

OpenClaw skill for [AnyList](https://www.anylist.com/) grocery and shopping list management.

> **Note:** This uses the unofficial [anylist-js](https://github.com/bobby060/anylist-js) library. Not affiliated with AnyList.

## Setup

```bash
npm install
node scripts/setup.mjs   # Enter your AnyList email & password
```

Credentials are stored at `~/.config/anylist/.env`.

## Usage

This is an [OpenClaw](https://openclaw.ai) skill — it's used by the AI agent automatically when you ask about grocery lists, shopping lists, or AnyList.

### Available Scripts

```bash
# List all lists
node scripts/get-lists.mjs

# Get items from a list
node scripts/get-items.mjs "Groceries"
node scripts/get-items.mjs "Groceries" --checked --notes

# Add an item
node scripts/add-item.mjs "Groceries" "Milk" --qty 2 --notes "whole milk"

# Check off an item (mark complete)
node scripts/remove-item.mjs "Groceries" "Milk"

# Permanently delete an item
node scripts/delete-item.mjs "Groceries" "Milk"
```

## License

[MIT](LICENSE)
