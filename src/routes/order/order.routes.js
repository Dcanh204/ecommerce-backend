import express from 'express';
import * as orderController from '../../controllers/order/order.controller.js'
const orderRouter = express.Router();

orderRouter.post('/', orderController.place_order);

export default orderRouter;