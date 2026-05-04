import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getUserByUsername } from '../lib/user-store.js';
import { signToken } from '../lib/jwt.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }
  const user = await getUserByUsername(username);
  if (!user) {
    res.status(401).json({ message: 'Invalid username or password' });
    return;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ message: 'Invalid username or password' });
    return;
  }
  const token = signToken({ userId: user.id, username: user.username, role: user.role });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

router.get('/auth/me', requireAuth, (req: AuthRequest, res) => {
  res.json(req.user);
});

export default router;
