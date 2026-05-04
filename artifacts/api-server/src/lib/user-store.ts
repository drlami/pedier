import bcrypt from 'bcryptjs';
import { db, usersTable } from '@workspace/db';
import { eq } from 'drizzle-orm';

export type UserRole = 'admin' | 'specialist' | 'resident';

export interface PublicUser {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

function toPublicUser(row: typeof usersTable.$inferSelect): PublicUser {
  return {
    id: row.id,
    username: row.username,
    role: row.role as UserRole,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function seedAdminUser(): Promise<void> {
  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, 'drlamiqurt'));
  if (existing.length === 0) {
    const passwordHash = await bcrypt.hash('3oday@Rahaf', 12);
    await db.insert(usersTable).values({
      id: crypto.randomUUID(),
      username: 'drlamiqurt',
      passwordHash,
      role: 'admin',
    });
  }
}

export async function getAllUsers(): Promise<PublicUser[]> {
  const rows = await db.select().from(usersTable);
  return rows.map(toPublicUser);
}

export async function getUserByUsername(
  username: string,
): Promise<{ id: string; username: string; passwordHash: string; role: UserRole } | undefined> {
  const rows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));
  if (rows.length === 0) return undefined;
  const row = rows[0];
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.passwordHash,
    role: row.role as UserRole,
  };
}

export async function createUser(
  username: string,
  password: string,
  role: UserRole,
): Promise<PublicUser> {
  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));
  if (existing.length > 0) throw new Error('Username already exists');
  const passwordHash = await bcrypt.hash(password, 12);
  const id = crypto.randomUUID();
  const rows = await db
    .insert(usersTable)
    .values({ id, username, passwordHash, role })
    .returning();
  return toPublicUser(rows[0]);
}

export async function updateUserRole(
  id: string,
  role: UserRole,
): Promise<PublicUser | null> {
  const rows = await db
    .update(usersTable)
    .set({ role })
    .where(eq(usersTable.id, id))
    .returning();
  if (rows.length === 0) return null;
  return toPublicUser(rows[0]);
}

export async function deleteUser(id: string): Promise<boolean> {
  const rows = await db
    .delete(usersTable)
    .where(eq(usersTable.id, id))
    .returning();
  return rows.length > 0;
}
