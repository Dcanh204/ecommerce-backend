import { StatusCodes } from "http-status-codes";
import cartService from "../../service/home/cart.service.js";
import catchAsync from "../../utils/catchAsync.js";


export const add_to_cart = catchAsync(async (req, res) => {
  const { userId, quantity, productId } = req.body;
  const cart = await cartService.add_to_cart(userId, quantity, productId);
  res.status(StatusCodes.CREATED).json({
    message: "Thêm giỏ hàng thành công",
    cart
  })
})

export const get_cart_product = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { cart_products, price, cart_product_count, shipping_fee, outOfStockProduct, buy_product_item } = await cartService.get_cart_product(userId)
  res.status(StatusCodes.OK).json({
    cart_products,
    price,
    cart_product_count,
    shipping_fee,
    outOfStockProduct,
    buy_product_item
  })
})

export const delete_cart_product = catchAsync(async (req, res) => {
  const { cartId } = req.params;
  await cartService.delete_cart_product(cartId);
  res.status(StatusCodes.OK).json({
    message: "Đã xóa khỏi giỏ hàng"
  })
})

export const quantity_inc = catchAsync(async (req, res) => {
  const { cartId } = req.params;
  await cartService.quantity_inc(cartId);
  res.status(StatusCodes.OK).json({
    message: "Cập nhật số lượng thành công"
  })
})

export const quantity_dec = catchAsync(async (req, res) => {
  const { cartId } = req.params;
  await cartService.quantity_dec(cartId);
  res.status(StatusCodes.OK).json({
    message: "Cập nhật số lượng thành công"
  })
})