import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Vui lòng đăng nhập');
  }
  try {
    const decodeToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.id = decodeToken.id;
    req.role = decodeToken.role;
    next();
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Phiên đã hết hạn, vui lòng đăng nhập lại!');
  }
}