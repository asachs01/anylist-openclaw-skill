# AnyList API Reference

## Authentication
- Credentials: `~/.config/anylist/.env` with `ANYLIST_USERNAME` and `ANYLIST_PASSWORD`
- Uses `anylist-js` library (unofficial Node.js client for AnyList)
- Login creates a persistent WebSocket connection; always call `teardown()` when done

## Core Objects

### Client (`new AnyList({ email, password })`)
- `login()` - Authenticate
- `getLists()` - Fetch all lists (populates `client.lists`)
- `getListByName(name)` - Get list by name
- `createItem({ name, details? })` - Create new item object
- `teardown()` - Disconnect WebSocket

### List
- `list.name` - List name
- `list.items` - Array of Item objects
- `list.getItemByName(name)` - Find item by name (case-insensitive)
- `list.addItem(item)` - Add item to list
- `list.removeItem(item)` - **Permanently delete** item from list

### Item
- `item.name` - Item name
- `item.checked` - Boolean, whether item is checked off
- `item.details` - Notes/details string
- `item.quantity` - Numeric quantity
- `item.categoryMatchId` - Category identifier
- `item.save()` - Persist changes

## Gotchas
- `list.removeItem()` **deletes** the item permanently. To "check off", set `item.checked = true` then `item.save()`
- The `quantity` field is NOT part of the protobuf schema; the `_encode` method must be patched to omit it
- Adding an item that already exists (checked): uncheck it and update instead of creating a duplicate
- Category names require building a map from `client._userData.shoppingListsResponse.categoryGroupResponses`
- Always call `client.teardown()` to close the WebSocket connection
- Login is slow (~2-3 seconds); scripts should connect, do work, then disconnect
