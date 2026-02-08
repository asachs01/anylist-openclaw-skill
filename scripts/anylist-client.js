import AnyList from 'anylist-js';
import Item from 'anylist-js/lib/item.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// Patch Item._encode to not include 'quantity' field which doesn't exist in protobuf schema
Item.prototype._encode = function() {
  return new this._protobuf.ListItem({
    identifier: this._identifier,
    listId: this._listId,
    name: this._name,
    details: this._details,
    checked: this._checked,
    category: this._category,
    userId: this._userId,
    categoryMatchId: this._categoryMatchId,
    manualSortIndex: this._manualSortIndex,
  });
};

function loadCredentials() {
  const envPath = join(homedir(), '.config', 'anylist', '.env');
  try {
    const content = readFileSync(envPath, 'utf-8');
    const vars = {};
    for (const line of content.split('\n')) {
      const match = line.match(/^(\w+)=(.*)$/);
      if (match) vars[match[1]] = match[2].trim();
    }
    return vars;
  } catch (e) {
    throw new Error(`Cannot read credentials from ${envPath}. Run setup first.`);
  }
}

export async function createClient() {
  const creds = loadCredentials();
  const email = creds.ANYLIST_USERNAME;
  const password = creds.ANYLIST_PASSWORD;
  if (!email || !password) {
    throw new Error('Missing ANYLIST_USERNAME or ANYLIST_PASSWORD in ~/.config/anylist/.env');
  }
  const client = new AnyList({ email, password });
  await client.login();
  await client.getLists();
  return client;
}

export function getList(client, listName) {
  const list = client.getListByName(listName);
  if (!list) {
    const names = client.lists.map(l => l.name).join(', ');
    throw new Error(`List "${listName}" not found. Available: ${names}`);
  }
  return list;
}

export function buildCategoryMap(client) {
  const categoryMap = {};
  try {
    const userData = client._userData;
    if (userData?.shoppingListsResponse?.categoryGroupResponses) {
      for (const gr of userData.shoppingListsResponse.categoryGroupResponses) {
        if (gr.categoryGroup?.categories) {
          for (const cat of gr.categoryGroup.categories) {
            if (cat.identifier && cat.name) categoryMap[cat.identifier] = cat.name;
          }
        }
      }
    }
  } catch {}
  return categoryMap;
}
