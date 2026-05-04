import { StatusCodes } from "http-status-codes";
import catchAsync from './../utils/catchAsync.js';
import { parseForm } from './../utils/formidable.js';
import { uploadImage } from './../utils/uploadImage.js';
import authService from "../service/auth.service.js";

export const admin_login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const token = await authService.admin_login(email, password);
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
  const userInfo = await authService.getMe(id, role);
  res.status(StatusCodes.OK).json({
    userInfo
  })
})

export const seller_register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const token = await authService.seller_register(name, email, password);
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
  const token = await authService.seller_login(email, password);
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

export const profile_image_upload = catchAsync(async (req, res) => {
  const { id } = req;
  const { files } = await parseForm(req);
  const image = files?.image?.[0];
  const imageUrl = await uploadImage(image.filepath, 'profiles');
  const userInfo = await authService.profile_image_upload(id, imageUrl);
  res.status(StatusCodes.OK).json({
    message: "Cập nhật ảnh thành công",
    userInfo
  })
})
export const profile_info_add = catchAsync(async (req, res) => {
  const { id } = req;
  const { shopName, city, address } = req.body;
  const userInfo = await authService.profile_info_add(id, shopName, city, address);
  res.status(StatusCodes.OK).json({
    message: "Cập nhật thành công",
    userInfo
  })
})

export const logout = catchAsync(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  })

  res.status(StatusCodes.OK).json({
    message: "Đăng xuất thành công"
  })
})
