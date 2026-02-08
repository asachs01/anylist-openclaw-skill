#!/usr/bin/env node
// Usage: get-lists.mjs [--help]
// Lists all AnyList lists with item counts.

import { createClient } from './anylist-client.js';

if (process.argv.includes('--help')) {
  console.log(`Usage: get-lists.mjs
Lists all AnyList lists with unchecked item counts.`);
  process.exit(0);
}

try {
  const client = await createClient();
  const lists = client.lists.map(l => ({
    name: l.name,
    uncheckedItems: l.items ? l.items.filter(i => !i.checked).length : 0,
    totalItems: l.items ? l.items.length : 0,
  }));
  console.log(JSON.stringify(lists, null, 2));
  await client.teardown();
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
