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

export const get_admin_orders = catchAsync(async (req, res) => {
  const { searchValue } = req.query;
  const page = parseInt(req.query.page);
  const parPage = parseInt(req.query.parPage);
  const { orders, totalOrders } = await orderService.get_admin_orders(searchValue, page, parPage);
  res.status(StatusCodes.OK).json({
    orders,
    totalOrders
  })
})

export const get_admin_order = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { order } = await orderService.get_admin_order(orderId);
  res.status(StatusCodes.OK).json({
    order
  })
})
export const admin_order_status_update = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  await orderService.admin_order_status_update(orderId, status);
  res.status(StatusCodes.OK).json({
    message: "cập nhật trạng thái đơn hàng thành công"
  })
})

export const get_seller_orders = catchAsync(async (req, res) => {
  const { sellerId } = req.params;
  console.log(sellerId)
  const { searchValue } = req.query;
  const page = parseInt(req.query.page);
  const parPage = parseInt(req.query.parPage);
  const { orders, totalOrders } = await orderService.get_seller_orders(searchValue, page, parPage, sellerId);
  res.status(StatusCodes.OK).json({
    orders,
    totalOrders
  })
})



