#!/usr/bin/env node
// Usage: setup.mjs [--help]
// Interactive setup - prompts for AnyList credentials and writes ~/.config/anylist/.env

import { createInterface } from 'readline';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

if (process.argv.includes('--help')) {
  console.log(`Usage: setup.mjs
Interactively prompts for AnyList email and password, then writes credentials to ~/.config/anylist/.env`);
  process.exit(0);
}

const rl = createInterface({ input: process.stdin, output: process.stderr });
const ask = (q) => new Promise(r => rl.question(q, r));

const email = await ask('AnyList email: ');
const password = await ask('AnyList password: ');
rl.close();

const configDir = join(homedir(), '.config', 'anylist');
mkdirSync(configDir, { recursive: true });
const envPath = join(configDir, '.env');

writeFileSync(envPath, `ANYLIST_USERNAME=${email}\nANYLIST_PASSWORD=${password}\n`);
console.log(`Credentials saved to ${envPath}`);
