import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import aiRouter from "./ai.js";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import customProtocolsRouter from "./custom-protocols.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(aiRouter);
router.use(customProtocolsRouter);

export default router;
