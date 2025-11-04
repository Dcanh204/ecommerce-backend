import { StatusCodes } from "http-status-codes";
import AuthService from "../service/auth.service.js";
import catchAsync from './../utils/catchAsync.js';

export const admin_login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const token = await AuthService.admin_login(email, password);
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })
  res.status(StatusCodes.OK).json({
    message: "Đăng nhập thành công",
    token
  })
})

export const getMe = catchAsync(async (req, res) => {
  const { id, role } = req;
  const userInfo = await AuthService.getMe(id, role);
  res.status(StatusCodes.OK).json({
    userInfo
  })
})

export const seller_register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const token = await AuthService.seller_register(name, email, password);
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

export const seller_login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const token = await AuthService.seller_login(email, password);
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })
  res.status(StatusCodes.OK).json({
    message: "Đăng nhập thành công",
    token
  })
})