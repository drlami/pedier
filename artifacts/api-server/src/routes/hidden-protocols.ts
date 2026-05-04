import { Router } from 'express';
import {
  getHiddenProtocolIds,
  hideProtocol,
  unhideProtocol,
} from '../lib/hidden-protocols-store.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/hidden-protocols', requireAdmin, async (_req, res) => {
  res.json(await getHiddenProtocolIds());
});

router.post('/hidden-protocols', requireAdmin, async (req, res) => {
  const { id } = req.body as { id?: string };
  if (!id) {
    res.status(400).json({ message: 'id is required' });
    return;
  }
  await hideProtocol(id);
  res.status(201).json({ id });
});

router.delete('/hidden-protocols/:id', requireAdmin, async (req, res) => {
  await unhideProtocol(req.params.id);
  res.status(204).send();
});

export default router;
