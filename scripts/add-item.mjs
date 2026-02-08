#!/usr/bin/env node
// Usage: add-item.mjs <listName> <itemName> [--qty N] [--notes "text"] [--help]

import { createClient, getList } from './anylist-client.js';

const args = process.argv.slice(2);
if (args.includes('--help') || args.length < 2) {
  console.log(`Usage: add-item.mjs <listName> <itemName> [--qty N] [--notes "text"]
  --qty N       Set quantity (default: 1)
  --notes text  Add notes to the item
If item already exists and is checked, it will be unchecked.`);
  process.exit(args.includes('--help') ? 0 : 1);
}

function getFlag(args, flag) {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return null;
  return args[idx + 1];
}

const flagNames = ['--qty', '--notes'];
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (flagNames.includes(args[i])) { i++; continue; }
  if (args[i].startsWith('--')) continue;
  positional.push(args[i]);
}

const listName = positional[0];
const itemName = positional[1];
const qty = parseInt(getFlag(args, '--qty')) || 1;
const notes = getFlag(args, '--notes');

try {
  const client = await createClient();
  const list = getList(client, listName);
  const existing = list.getItemByName(itemName);

  if (existing) {
    if (existing.checked) existing.checked = false;
    if (qty !== 1) existing.quantity = qty;
    if (notes !== null) existing.details = notes;
    await existing.save();
    console.log(JSON.stringify({ action: 'updated', name: existing.name }));
  } else {
    const opts = { name: itemName };
    if (notes) opts.details = notes;
    const item = client.createItem(opts);
    await list.addItem(item);
    if (qty !== 1 || notes) {
      if (qty !== 1) item.quantity = qty;
      if (notes) item.details = notes;
      await item.save();
    }
    console.log(JSON.stringify({ action: 'added', name: item.name }));
  }
  await client.teardown();
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
