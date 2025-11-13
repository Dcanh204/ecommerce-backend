import express from 'express';
import { authMiddleware } from './../../middleware/auth.middleware.js';
import * as productController from '../../controllers/dashboard/product.controller.js'
const productRouter = express.Router();

productRouter.post('/', authMiddleware, productController.addProduct);
productRouter.get('/', authMiddleware, productController.getProduct);
productRouter.get('/:id', authMiddleware, productController.getProductById);
productRouter.put('/:id', authMiddleware, productController.updateProduct);
productRouter.put('/updateImage/:id', authMiddleware, productController.updateImage);
productRouter.delete('/:id', authMiddleware, productController.deleteProduct);
export default productRouter;