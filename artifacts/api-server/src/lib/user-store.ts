import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'specialist' | 'resident';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

function ensureDataDir(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadUsers(): User[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) return [];
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function seedAdminUser(): Promise<void> {
  const users = loadUsers();
  const adminExists = users.some((u) => u.username === 'drlamiqurt');
  if (!adminExists) {
    const passwordHash = await bcrypt.hash('3oday@Rahaf', 12);
    users.push({
      id: crypto.randomUUID(),
      username: 'drlamiqurt',
      passwordHash,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    saveUsers(users);
  }
}

export function getAllUsers(): PublicUser[] {
  return loadUsers().map(({ passwordHash: _ph, ...u }) => u);
}

export function getUserByUsername(username: string): User | undefined {
  return loadUsers().find((u) => u.username === username);
}

export async function createUser(
  username: string,
  password: string,
  role: UserRole,
): Promise<PublicUser> {
  const users = loadUsers();
  if (users.some((u) => u.username === username)) {
    throw new Error('Username already exists');
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const newUser: User = {
    id: crypto.randomUUID(),
    username,
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  const { passwordHash: _ph, ...publicUser } = newUser;
  return publicUser;
}

export function updateUserRole(id: string, role: UserRole): PublicUser | null {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], role };
  saveUsers(users);
  const { passwordHash: _ph, ...publicUser } = users[idx];
  return publicUser;
}

export function deleteUser(id: string): boolean {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  users.splice(idx, 1);
  saveUsers(users);
  return true;
}
