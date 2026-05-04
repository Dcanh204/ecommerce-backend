import express from 'express';
import * as authControllers from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js';
const authRouter = express.Router();

authRouter.post("/admin-login", authControllers.admin_login);
authRouter.get("/get-me", authMiddleware, authControllers.getMe);
authRouter.post("/seller-register", authControllers.seller_register);
authRouter.post("/seller-login", authControllers.seller_login);
authRouter.post("/profile-image-upload", authMiddleware, authControllers.profile_image_upload);
authRouter.post("/profile-info-add", authMiddleware, authControllers.profile_info_add);
authRouter.get("/logout", authMiddleware, authControllers.logout);
export default authRouter;