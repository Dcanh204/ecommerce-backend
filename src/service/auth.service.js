import { StatusCodes } from "http-status-codes";
import Admin from "../models/admin.model.js";
import ApiError from './../utils/ApiError.js';
import bcrypt from 'bcrypt';
import { createToken } from "../utils/tokenCreate.js";
import Seller from "../models/seller.model.js";
import SellerCustomer from '../models/chat/sellerCustomer.model.js';

class AuthService {
  async admin_login(email, password) {
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) { throw new ApiError(StatusCodes.NOT_FOUND, "Email không tồn tại!") }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) { throw new ApiError(StatusCodes.UNAUTHORIZED, "Mật khẩu không đúng!") }

    const token = createToken({
      id: admin.id,
      role: admin.role
    })
    return token;
  };

  // get profile 
  async getMe(id, role) {
    let userInfo;
    if (role === 'admin') {
      userInfo = await Admin.findById(id).select('-password');
    } else if (role === 'seller') {
      userInfo = await Seller.findById(id).select('-password');
    } else {
      throw new ApiError(StatusCodes.FORBIDDEN, "Vai trò không hợp lệ");
    }

    if (!userInfo) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy người dùng");
    }
    return userInfo;
  }

  // seller register

  async seller_register(name, email, password) {
    const getUser = await Seller.findOne({ email });
    if (getUser) { throw new ApiError(StatusCodes.CONFLICT, "Email đã tồn tại") }

    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = await Seller.create({
      name,
      email,
      password: hashedPassword,
      method: 'manually',
      shopInfo: {}
    });
    await SellerCustomer.create({
      myId: seller.id
    })

    const token = createToken({
      id: seller.id,
      role: seller.role
    })
    return token;
  };

  async seller_login(email, password) {
    const seller = await Seller.findOne({ email }).select('+password');
    if (!seller) { throw new ApiError(StatusCodes.NOT_FOUND, "Email không tồn tại!") }
    const match = await bcrypt.compare(password, seller.password);
    if (!match) { throw new ApiError(StatusCodes.UNAUTHORIZED, "Mật khẩu không đúng!") }

    const token = createToken({
      id: seller.id,
      role: seller.role
    })
    return token;
  };
  async profile_image_upload(id, imageUrl) {
    const userInfo = await Seller.findByIdAndUpdate(id, {
      image: imageUrl
    }, { new: true })
    return userInfo;
  };

  async profile_info_add(id, shopName, city, address) {
    const userInfo = await Seller.findByIdAndUpdate(id, {
      shopInfo: {
        shopName,
        city,
        address
      }
    }, { new: true })
    return userInfo;
  };
}

export default new AuthService();