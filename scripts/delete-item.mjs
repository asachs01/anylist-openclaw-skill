#!/usr/bin/env node
// Usage: delete-item.mjs <listName> <itemName> [--help]
// Permanently deletes an item from the list.

import { createClient, getList } from './anylist-client.js';

const args = process.argv.slice(2);
if (args.includes('--help') || args.length < 2) {
  console.log(`Usage: delete-item.mjs <listName> <itemName>
Permanently deletes an item from the list.`);
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
  await list.removeItem(item);
  console.log(JSON.stringify({ action: 'deleted', name: item.name }));
  await client.teardown();
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
