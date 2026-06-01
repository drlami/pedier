import { Router } from "express";

const router = Router();

router.get("/healthz", (_req: unknown, res: any) => {
  return res.status(200).json({ status: "ok" });
});

export default router;