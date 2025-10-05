import express from 'express';
import * as authControllers from '../controllers/auth.controller.js'
const authRouter = express.Router();

authRouter.post("/admin-login", authControllers.admin_login);

export default authRouter;