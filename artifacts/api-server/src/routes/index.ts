import { Router, type IRouter } from "express";
import healthRouter from "./health";
import casperRouter from "./casper";

const router: IRouter = Router();

router.use(healthRouter);
router.use(casperRouter);

export default router;
