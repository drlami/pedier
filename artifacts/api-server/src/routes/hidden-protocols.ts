import { Router } from 'express';
import {
  getHiddenProtocolIds,
  hideProtocol,
  unhideProtocol,
} from '../lib/hidden-protocols-store.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/hidden-protocols', requireAdmin, (_req, res) => {
  res.json(getHiddenProtocolIds());
});

router.post('/hidden-protocols', requireAdmin, (req, res) => {
  const { id } = req.body as { id?: string };
  if (!id) {
    res.status(400).json({ message: 'id is required' });
    return;
  }
  hideProtocol(id);
  res.status(201).json({ id });
});

router.delete('/hidden-protocols/:id', requireAdmin, (req, res) => {
  unhideProtocol(req.params.id);
  res.status(204).send();
});

export default router;
