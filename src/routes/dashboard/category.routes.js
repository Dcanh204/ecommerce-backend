import express from 'express';
import * as categoryControllers from '../../controllers/dashboard/category.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js';
const categoryRouter = express.Router()

categoryRouter.post("/", authMiddleware, categoryControllers.addCategory)
categoryRouter.get("/", authMiddleware, categoryControllers.getCategory)
export default categoryRouter;