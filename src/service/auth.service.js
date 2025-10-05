import { StatusCodes } from "http-status-codes";
import Admin from "../models/admin.model.js";
import ApiError from './../utils/ApiError.js';
import bcrypt from 'bcrypt';
import { createToken } from "../utils/tokenCreate.js";

class AuthService {
  async admin_login(email, password) {
    const admin = await Admin.findOne({ email });
    if (!admin) { throw new ApiError(StatusCodes.NOT_FOUND, "Email không tồn tại!") }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) { throw new ApiError(StatusCodes.UNAUTHORIZED, "Mật khẩu không đúng!") }

    const token = createToken({
      id: admin.id,
      role: admin.role
    })

    return token;

  }
}

export default new AuthService();