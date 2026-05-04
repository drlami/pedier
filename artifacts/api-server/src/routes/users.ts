import { Router } from 'express';
import {
  getAllUsers,
  createUser,
  updateUserRole,
  deleteUser,
  type UserRole,
} from '../lib/user-store.js';
import { requireAdmin, type AuthRequest } from '../middleware/auth.js';

const router = Router();

const VALID_ROLES: UserRole[] = ['admin', 'specialist', 'resident'];

router.get('/users', requireAdmin, async (_req, res) => {
  res.json(await getAllUsers());
});

router.post('/users', requireAdmin, async (req, res) => {
  const { username, password, role } = req.body as {
    username?: string;
    password?: string;
    role?: UserRole;
  };
  if (!username || !password || !role || !VALID_ROLES.includes(role)) {
    res.status(400).json({ message: 'Username, password, and valid role are required' });
    return;
  }
  try {
    const user = await createUser(username, password, role);
    res.status(201).json(user);
  } catch (err: unknown) {
    res.status(409).json({ message: (err as Error).message });
  }
});

router.put('/users/:id', requireAdmin, async (req: AuthRequest, res) => {
  const { role } = req.body as { role?: UserRole };
  if (!role || !VALID_ROLES.includes(role)) {
    res.status(400).json({ message: 'Valid role required (admin, specialist, resident)' });
    return;
  }
  if (req.params.id === req.user?.userId && role !== 'admin') {
    res.status(400).json({ message: 'You cannot change your own role' });
    return;
  }
  const updated = await updateUserRole(req.params.id, role);
  if (!updated) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(updated);
});

router.delete('/users/:id', requireAdmin, async (req: AuthRequest, res) => {
  if (req.params.id === req.user?.userId) {
    res.status(400).json({ message: 'You cannot delete your own account' });
    return;
  }
  const deleted = await deleteUser(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(204).send();
});

export default router;
