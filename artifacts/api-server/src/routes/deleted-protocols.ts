import { Router } from 'express';
import {
  getDeletedProtocolIds,
  deleteBuiltinProtocol,
  restoreDeletedProtocol,
} from '../lib/deleted-protocols-store.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/deleted-protocols', requireAdmin, (_req, res) => {
  res.json(getDeletedProtocolIds());
});

router.post('/deleted-protocols', requireAdmin, (req, res) => {
  const { id } = req.body as { id?: string };
  if (!id) {
    res.status(400).json({ message: 'id is required' });
    return;
  }
  deleteBuiltinProtocol(id);
  res.status(201).json({ id });
});

router.delete('/deleted-protocols/:id', requireAdmin, (req, res) => {
  restoreDeletedProtocol(req.params.id);
  res.status(204).send();
});

export default router;
