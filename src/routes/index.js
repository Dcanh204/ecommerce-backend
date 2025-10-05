import express from 'express';
import authRouter from './auth.routes.js';

const rootRouter = express.Router();
//auth router
rootRouter.use("/", authRouter)


export default rootRouter;