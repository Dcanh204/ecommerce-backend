import { StatusCodes } from "http-status-codes";
import Customer from "../../models/customer.model.js";
import ApiError from "../../utils/ApiError.js";
import bcrypt from 'bcrypt';
import SellerCustomer from "../../models/chat/sellerCustomer.model.js";
import { createToken } from "../../utils/tokenCreate.js";
class CustomerService {
  async customer_register(name, email, password) {
    const getCustomer = await Customer.findOne({ email });
    if (getCustomer) {
      throw new ApiError(StatusCodes.CONFLICT, "Email đã tồn tại");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      name,
      email,
      password: hashedPassword,
      method: 'manually'
    })

    await SellerCustomer.create({
      myId: customer.id
    })

    const token = createToken({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      method: customer.method
    })

    return token;
  }

  async customer_login(email, password) {
    const customer = await Customer.findOne({ email }).select('+password');
    if (!customer) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Email không tồn tại")
    }
    const match = await bcrypt.compare(password, customer.password)
    if (!match) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Mật khẩu không đúng");
    }
    const token = createToken({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      method: customer.method
    })

    return token
  }
}

export default new CustomerService;