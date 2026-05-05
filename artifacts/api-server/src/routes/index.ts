import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import aiRouter from "./ai.js";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import customProtocolsRouter from "./custom-protocols.js";
import hiddenProtocolsRouter from "./hidden-protocols.js";
import customDrugsRouter from "./custom-drugs.js";
import activityLogsRouter from "./activity-logs.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(aiRouter);
router.use(customProtocolsRouter);
router.use(hiddenProtocolsRouter);
router.use(customDrugsRouter);
router.use(activityLogsRouter);

export default router;
