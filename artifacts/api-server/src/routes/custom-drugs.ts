import { Router } from 'express';
import {
  getAllCustomDrugs,
  upsertCustomDrug,
  deleteCustomDrug,
} from '../lib/custom-drug-store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/custom-drugs', requireAuth, async (_req, res) => {
  const drugs = await getAllCustomDrugs();
  res.json(drugs);
});

router.put('/custom-drugs/:id', requireAuth, async (req, res) => {
  const drug = req.body;
  if (!drug?.id || drug.id !== req.params.id) {
    res.status(400).json({ message: 'Drug id is required and must match the URL' });
    return;
  }
  const isCustom = drug.isCustom === true;
  await upsertCustomDrug(drug, isCustom);
  res.json(drug);
});

router.delete('/custom-drugs/:id', requireAuth, async (req, res) => {
  await deleteCustomDrug(req.params.id);
  res.status(204).send();
});

export default router;
