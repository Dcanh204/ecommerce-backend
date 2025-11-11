import express from 'express';
import { authMiddleware } from './../../middleware/auth.middleware.js';
import * as productController from '../../controllers/dashboard/product.controller.js'
const productRouter = express.Router();
productRouter.post('/', authMiddleware, productController.addProduct);

export default productRouter;