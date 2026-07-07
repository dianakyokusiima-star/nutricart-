import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import medicationsRouter from "./medications";
import interactionsRouter from "./interactions";
import pricesRouter from "./prices";
import savingsRouter from "./savings";
import remindersRouter from "./reminders";
import dashboardRouter from "./dashboard";
import recommendationsRouter from "./recommendations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(medicationsRouter);
router.use(interactionsRouter);
router.use(pricesRouter);
router.use(savingsRouter);
router.use(remindersRouter);
router.use(dashboardRouter);
router.use(recommendationsRouter);

export default router;
