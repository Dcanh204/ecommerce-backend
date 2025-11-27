import catchAsync from "../../utils/catchAsync.js";
import orderService from "../../service/order/order.service.js";
import { StatusCodes } from "http-status-codes";


export const place_order = catchAsync(async (req, res) => {
  const { products, price, shipping_fee, items, shoppingInfo, userId } = req.body;
  const orderId = await orderService.place_order(products, price, shipping_fee, items, shoppingInfo, userId);
  res.status(StatusCodes.OK).json({
    message: "Đặt đơn hàng thành công",
    orderId
  })
})