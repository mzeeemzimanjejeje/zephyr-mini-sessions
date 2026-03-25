import { Router, type IRouter } from "express";
import healthRouter from "./health";
import casperRouter from "./casper";
import bwmRouter from "./bwm";
import imdbRouter from "./imdb";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(casperRouter);
router.use(bwmRouter);
router.use(imdbRouter);
router.use(chatRouter);

export default router;
