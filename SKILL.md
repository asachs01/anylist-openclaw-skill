---
name: anylist
description: Manage AnyList grocery lists, shopping lists, and household inventory. Use for adding, removing, checking off, or viewing items on any AnyList list. Triggers on grocery list management, shopping lists, AnyList, adding/removing items from lists, checking off items, household inventory, pantry tracking, freezer inventory, meal planning lists, Costco/Walmart/Target lists.
---

# AnyList

Manage lists via CLI scripts in `scripts/`. All scripts output JSON to stdout, logs to stderr.

## Setup

First run: `node scripts/setup.mjs` — prompts for AnyList email/password, saves to `~/.config/anylist/.env`.

## Scripts

All scripts run from the skill directory. Install deps first: `npm install` (in the skill's `anylist/` directory).

```bash
# List all lists
node scripts/get-lists.mjs

# Get items from a list (unchecked only by default)
node scripts/get-items.mjs "Groceries"
node scripts/get-items.mjs "Groceries" --checked --notes

# Add an item (re-adds checked items automatically)
node scripts/add-item.mjs "Groceries" "Milk" --qty 2 --notes "whole milk"

# Check off an item (mark complete, does NOT delete)
node scripts/remove-item.mjs "Groceries" "Milk"

# Permanently delete an item
node scripts/delete-item.mjs "Groceries" "Milk"
```

## Workflow Patterns

**Add multiple items**: Run `add-item.mjs` once per item. Each call connects/disconnects (~3s overhead each).

**Check off purchased items**: Use `remove-item.mjs` (checks off). Use `delete-item.mjs` only when permanently removing.

**Known lists**: Groceries, Costco, Walmart, Target, Pantry Inventory, Downstairs Freezer Inventory.

## API Details

See `references/api.md` for the full anylist-js API reference and gotchas.
