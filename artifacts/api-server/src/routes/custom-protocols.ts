import { Router } from 'express';
import {
  getAllCustomProtocols,
  getCustomProtocolById,
  createCustomProtocol,
  updateCustomProtocol,
  deleteCustomProtocol,
} from '../lib/custom-protocol-store.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/protocols', requireAuth, (_req, res) => {
  res.json(getAllCustomProtocols());
});

router.get('/protocols/:id', requireAuth, (req, res) => {
  const protocol = getCustomProtocolById(req.params.id);
  if (!protocol) {
    res.status(404).json({ message: 'Protocol not found' });
    return;
  }
  res.json(protocol);
});

router.post('/protocols', requireAdmin, (req, res) => {
  const data = req.body;
  if (!data?.id || !data?.name || !data?.system) {
    res.status(400).json({ message: 'id, name, and system are required' });
    return;
  }
  const safeId = String(data.id)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  try {
    const protocol = createCustomProtocol({ ...data, id: safeId });
    res.status(201).json(protocol);
  } catch (err: any) {
    res.status(409).json({ message: err.message });
  }
});

router.put('/protocols/:id', requireAdmin, (req, res) => {
  const updated = updateCustomProtocol(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ message: 'Protocol not found' });
    return;
  }
  res.json(updated);
});

router.delete('/protocols/:id', requireAdmin, (req, res) => {
  const deleted = deleteCustomProtocol(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: 'Protocol not found' });
    return;
  }
  res.status(204).send();
});

export default router;
