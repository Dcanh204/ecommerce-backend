import catchAsync from "../../utils/catchAsync.js";
import orderService from "../../service/order/order.service.js";
import { StatusCodes } from "http-status-codes";


export const place_order = catchAsync(async (req, res) => {
  const { products, price, shipping_fee, items, shippingInfo, userId } = req.body;
  const orderId = await orderService.place_order(products, price, shipping_fee, items, shippingInfo, userId);
  res.status(StatusCodes.OK).json({
    message: "Đặt đơn hàng thành công",
    orderId
  })
})

export const get_orders = catchAsync(async (req, res) => {
  const { userId, status } = req.query;
  const orders = await orderService.get_orders(userId, status);
  res.status(StatusCodes.OK).json({
    orders
  })
})

export const get_order_by_id = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.get_order_by_id(orderId);
  res.status(StatusCodes.OK).json({
    order
  })
})

export const get_order_dashboard = catchAsync(async (req, res) => {
  const { userId } = req.params
  const { recentOrders, totalOrder, totalPendingOrder, totalCancelledOrder } = await orderService.get_order_dashboard(userId)
  res.status(StatusCodes.OK).json({
    recentOrders,
    totalOrder,
    totalPendingOrder,
    totalCancelledOrder
  })
})