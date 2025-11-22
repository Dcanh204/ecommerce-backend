import { StatusCodes } from "http-status-codes";
import homeService from "../../service/home/home.service.js";
import catchAsync from "../../utils/catchAsync.js";

export const getCategory = catchAsync(async (req, res) => {
  const categories = await homeService.getCategory();
  res.status(StatusCodes.OK).json({
    categories,
  })
})

export const getProduct = catchAsync(async (req, res) => {
  const { products, latest_product, topRate_product, discount_product } = await homeService.getProduct();
  res.status(StatusCodes.OK).json({
    products,
    latest_product,
    topRate_product,
    discount_product
  })
})