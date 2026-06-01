import { Router } from "express";
import type { RequestHandler } from "express";

const router = Router();

const healthzHandler: RequestHandler = (_req, res) => {
  res.status(200).json({ status: "ok" });
};

router.get("/healthz", healthzHandler);

export default router;