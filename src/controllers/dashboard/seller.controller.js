import { StatusCodes } from "http-status-codes";
import sellerService from "../../service/seller.service.js";
import catchAsync from "../../utils/catchAsync.js";

export const getSeller = catchAsync(async (req, res) => {
  const { status, searchValue, parPage, page } = req.query;
  const { sellers, totalSellers } = await sellerService.getSeller(status, parPage, page, searchValue);
  res.status(StatusCodes.OK).json({
    sellers,
    totalSellers
  })
})

export const getSellerById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const seller = await sellerService.getSellerById(id);
  res.status(StatusCodes.OK).json({
    seller
  })
})
export const updateStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const seller = await sellerService.updateStatus(id, status);
  res.status(StatusCodes.OK).json({
    message: "Cập nhật trạng thái thành công",
    seller
  })
})
