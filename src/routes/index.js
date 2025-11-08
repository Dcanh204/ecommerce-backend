import express from 'express';
import authRouter from './auth.routes.js';
import categoryRouter from './dashboard/category.routes.js';

const rootRouter = express.Router();
//auth router
rootRouter.use("/auth", authRouter);
rootRouter.use("/categories", categoryRouter);



export default rootRouter;