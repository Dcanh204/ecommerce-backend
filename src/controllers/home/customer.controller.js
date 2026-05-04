import { StatusCodes } from "http-status-codes";
import customerService from "../../service/home/customer.service.js";
import catchAsync from "../../utils/catchAsync.js";


export const customer_register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const token = await customerService.customer_register(name, email, password);
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  res.status(StatusCodes.CREATED).json({
    message: "Đăng ký thành công",
    token
  })
})

export const customer_login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const token = await customerService.customer_login(email, password);
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  res.status(StatusCodes.CREATED).json({
    message: "Đăng nhập thành công",
    token
  })
})

export const customer_logout = catchAsync(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  })

  res.status(StatusCodes.OK).json({
    message: "Đăng xuất thành công"
  })
})
