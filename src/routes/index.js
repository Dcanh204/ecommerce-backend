import express from 'express';
import authRouter from './auth.routes.js';

const rootRouter = express.Router();
//auth router
rootRouter.use("/auth", authRouter)


export default rootRouter;