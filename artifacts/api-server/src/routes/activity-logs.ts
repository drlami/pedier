import { Router } from 'express';
import { requireAuth, requireAdmin, type AuthRequest } from '../middleware/auth.js';
import { recordActivity, getActivityLogs } from '../lib/activity-log-store.js';

const router = Router();

router.post('/activity-logs/open', requireAuth, async (req: AuthRequest, res) => {
  const user = req.user!;
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || null;
  const ua = (req.headers['user-agent'] as string) || null;
  try {
    await recordActivity({
      userId: user.userId,
      username: user.username,
      role: user.role,
      event: 'app_open',
      ipAddress: ip ?? undefined,
      userAgent: ua ?? undefined,
    });
  } catch (err) {
    // Never let a logging failure surface as a 500 — just report it.
    console.error('[activity-log] app_open route error:', err);
  }
  res.status(204).end();
});

router.get('/activity-logs', requireAuth, requireAdmin, async (_req, res) => {
  const logs = await getActivityLogs(200);
  res.json(logs);
});

export default router;
