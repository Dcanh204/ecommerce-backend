import { StatusCodes } from "http-status-codes";
import AuthService from "../service/auth.service.js";

export const admin_login = async (req, res) => {
  const { email, password } = req.body;
  const token = await AuthService.admin_login(email, password);
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expirse: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })
  res.status(StatusCodes.OK).json({
    message: "Đăng nhập thành công",
    token
  })
}