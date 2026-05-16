import express from 'express';
import * as orderController from '../../controllers/order/order.controller.js'
const orderRouter = express.Router();

// PAYMENT
orderRouter.post('/create-vnpay-payment', orderController.create_vnpay_payment)
orderRouter.get('/vnpay-return', orderController.vnpay_return)
orderRouter.post('/', orderController.place_order);
orderRouter.get('/dashboard/:userId', orderController.get_order_dashboard);
orderRouter.get('/', orderController.get_orders);
orderRouter.get('/:orderId', orderController.get_order_by_id);

//admin
orderRouter.get('/admin/orders', orderController.get_admin_orders)
orderRouter.get('/admin/orders/:orderId', orderController.get_admin_order)
orderRouter.put('/admin/order-status/update/:orderId', orderController.admin_order_status_update)

// seller
orderRouter.get('/seller/orders/:sellerId', orderController.get_seller_orders)
orderRouter.get('/seller/order/:orderId', orderController.get_seller_order)
orderRouter.put('/seller/order-status/update/:orderId', orderController.seller_order_status_update)

// payment
orderRouter.post('/create-payment', orderController.create_payment)
orderRouter.get('/confirm/:orderId', orderController.order_confirm)


export default orderRouter;