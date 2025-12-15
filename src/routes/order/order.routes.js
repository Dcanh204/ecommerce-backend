import express from 'express';
import * as orderController from '../../controllers/order/order.controller.js'
const orderRouter = express.Router();

orderRouter.post('/', orderController.place_order);
orderRouter.get('/dashboard/:userId', orderController.get_order_dashboard);
orderRouter.get('/', orderController.get_orders);
orderRouter.get('/:orderId', orderController.get_order_by_id);
export default orderRouter;