import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'deleted-protocols.json');

function ensureDir() {
  const dir = dirname(DATA_FILE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function read(): string[] {
  if (!existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as string[];
  } catch {
    return [];
  }
}

function write(ids: string[]): void {
  ensureDir();
  writeFileSync(DATA_FILE, JSON.stringify(ids, null, 2), 'utf-8');
}

export function getDeletedProtocolIds(): string[] {
  return read();
}

export function deleteBuiltinProtocol(id: string): void {
  const ids = read();
  if (!ids.includes(id)) {
    ids.push(id);
    write(ids);
  }
}

export function restoreDeletedProtocol(id: string): void {
  write(read().filter((i) => i !== id));
}
