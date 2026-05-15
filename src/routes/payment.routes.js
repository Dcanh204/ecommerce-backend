import express from 'express';
import * as paymentController from '../controllers/payment/payment.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js';
const paymentRouter = express.Router();

paymentRouter.get('/create-stripe-connect-account', authMiddleware, paymentController.create_stripe_connect_account);
paymentRouter.put('/active-stripe-connect-account/:activeCode', authMiddleware, paymentController.active_stripe_connect_account);

export default paymentRouter;