import { Router } from "express";
import type { Request, Response as ExpressResponse } from "express";

const router = Router();

router.get("/healthz", (_req: Request, res: ExpressResponse) => {
  res.status(200).send({ status: "ok" });
});

export default router;