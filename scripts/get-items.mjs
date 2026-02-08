#!/usr/bin/env node
// Usage: get-items.mjs <listName> [--checked] [--notes] [--help]

import { createClient, getList, buildCategoryMap } from './anylist-client.js';

const args = process.argv.slice(2);
if (args.includes('--help') || args.length === 0) {
  console.log(`Usage: get-items.mjs <listName> [--checked] [--notes]
  --checked   Include checked-off items
  --notes     Include item notes/details`);
  process.exit(args.includes('--help') ? 0 : 1);
}

const flags = args.filter(a => a.startsWith('--'));
const positional = args.filter(a => !a.startsWith('--'));
const listName = positional[0];
const includeChecked = flags.includes('--checked');
const includeNotes = flags.includes('--notes');

try {
  const client = await createClient();
  const list = getList(client, listName);
  const categoryMap = buildCategoryMap(client);
  const items = (list.items || [])
    .filter(i => includeChecked || !i.checked)
    .map(i => {
      const r = { name: i.name, checked: !!i.checked, category: categoryMap[i.categoryMatchId] || 'other' };
      if (i.quantity && i.quantity !== 1) r.quantity = i.quantity;
      if (includeNotes && i.details) r.notes = i.details;
      return r;
    });
  console.log(JSON.stringify(items, null, 2));
  await client.teardown();
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
