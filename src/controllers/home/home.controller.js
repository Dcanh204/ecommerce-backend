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


export const query_products = catchAsync(async (req, res) => {
  const searchValue = req.query.searchValue || '';
  const { low, high, category, rating, sortPrice, pageNumber } = req.query;
  const limit = 15
  const { products, totalProduct, parPage } = await homeService.query_products(low, high, category, rating, sortPrice, pageNumber, limit, searchValue)

  res.status(StatusCodes.OK).json({
    products,
    totalProduct,
    parPage
  })
})

export const product_details = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const { product, relatedProducts, fromStore } = await homeService.product_details(slug);
  res.status(StatusCodes.OK).json({
    product,
    relatedProducts,
    fromStore
  })
})


export const product_review = catchAsync(async (req, res) => {
  const { name, review, rating, productId } = req.body;
  await homeService.product_review(name, review, rating, productId);
  res.status(StatusCodes.CREATED).json({
    message: "Đánh giá sản phẩm thành công"
  })
})