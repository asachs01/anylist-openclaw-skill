#!/usr/bin/env node
// Usage: remove-item.mjs <listName> <itemName> [--help]
// Checks off (marks complete) an item on the list.

import { createClient, getList } from './anylist-client.js';

const args = process.argv.slice(2);
if (args.includes('--help') || args.length < 2) {
  console.log(`Usage: remove-item.mjs <listName> <itemName>
Checks off (marks complete) an item. Does NOT delete it.`);
  process.exit(args.includes('--help') ? 0 : 1);
}

const positional = args.filter(a => !a.startsWith('--'));
const listName = positional[0];
const itemName = positional[1];

try {
  const client = await createClient();
  const list = getList(client, listName);
  const item = list.getItemByName(itemName);
  if (!item) throw new Error(`Item "${itemName}" not found in "${listName}"`);
  if (item.checked) {
    console.log(JSON.stringify({ action: 'already_checked', name: item.name }));
  } else {
    item.checked = true;
    await item.save();
    console.log(JSON.stringify({ action: 'checked', name: item.name }));
  }
  await client.teardown();
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
