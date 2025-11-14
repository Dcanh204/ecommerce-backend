import express from 'express'
import { authMiddleware } from './../../middleware/auth.middleware.js';
import * as sellerController from '../../controllers/dashboard/seller.controller.js'
const sellerRouter = express.Router();

sellerRouter.get('/', authMiddleware, sellerController.getSeller);
sellerRouter.get('/:id', authMiddleware, sellerController.getSellerById);
sellerRouter.put('/:id', authMiddleware, sellerController.updateStatus);

export default sellerRouter;