import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { CustomProtocol } from './custom-protocol-types.js';

const DATA_FILE = join(process.cwd(), 'data', 'custom-protocols.json');

function readProtocols(): CustomProtocol[] {
  if (!existsSync(DATA_FILE)) return [];
  try {
    const raw = readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as CustomProtocol[];
  } catch {
    return [];
  }
}

function writeProtocols(protocols: CustomProtocol[]): void {
  writeFileSync(DATA_FILE, JSON.stringify(protocols, null, 2), 'utf-8');
}

export function getAllCustomProtocols(): CustomProtocol[] {
  return readProtocols();
}

export function getCustomProtocolById(id: string): CustomProtocol | undefined {
  return readProtocols().find((p) => p.id === id);
}

export function createCustomProtocol(
  data: Omit<CustomProtocol, 'isCustom' | 'createdAt' | 'updatedAt'>
): CustomProtocol {
  const protocols = readProtocols();
  if (protocols.find((p) => p.id === data.id)) {
    throw new Error(`A protocol with id "${data.id}" already exists.`);
  }
  const now = new Date().toISOString();
  const protocol: CustomProtocol = {
    ...data,
    isCustom: true,
    createdAt: now,
    updatedAt: now,
  };
  protocols.push(protocol);
  writeProtocols(protocols);
  return protocol;
}

export function updateCustomProtocol(
  id: string,
  data: Partial<Omit<CustomProtocol, 'id' | 'isCustom' | 'createdAt'>>
): CustomProtocol | null {
  const protocols = readProtocols();
  const idx = protocols.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  protocols[idx] = {
    ...protocols[idx],
    ...data,
    id,
    isCustom: true,
    updatedAt: new Date().toISOString(),
  };
  writeProtocols(protocols);
  return protocols[idx];
}

export function deleteCustomProtocol(id: string): boolean {
  const protocols = readProtocols();
  const idx = protocols.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  protocols.splice(idx, 1);
  writeProtocols(protocols);
  return true;
}
