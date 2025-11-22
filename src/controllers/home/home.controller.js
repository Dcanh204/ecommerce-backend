import { StatusCodes } from "http-status-codes";
import homeService from "../../service/home/home.service.js";
import catchAsync from "../../utils/catchAsync.js";

export const getCategory = catchAsync(async (req, res) => {
  const categories = await homeService.getCategory();
  res.status(StatusCodes.OK).json({
    categories,
  })
})