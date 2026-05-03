import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'hidden-protocols.json');

function read(): string[] {
  if (!existsSync(DATA_FILE)) return [];
  try {
    const raw = readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function write(ids: string[]): void {
  writeFileSync(DATA_FILE, JSON.stringify(ids, null, 2), 'utf-8');
}

export function getHiddenProtocolIds(): string[] {
  return read();
}

export function hideProtocol(id: string): void {
  const ids = read();
  if (!ids.includes(id)) {
    ids.push(id);
    write(ids);
  }
}

export function unhideProtocol(id: string): void {
  write(read().filter((i) => i !== id));
}
