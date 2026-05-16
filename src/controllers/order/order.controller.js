import catchAsync from "../../utils/catchAsync.js";
import orderService from "../../service/order/order.service.js";
import { StatusCodes } from "http-status-codes";
import Stripe from 'stripe';
import CustomerOrder from "../../models/customerOrder.model.js";
import AuthorOrder from "../../models/authorOrder.model.js";
import moment from "moment";
import MyShopWallet from "../../models/myShopWallet.model.js";
import SellerWallet from "../../models/sellerWallet.model.js";
import mongoose from 'mongoose'
import Product from "../../models/product.model.js";
import crypto from 'crypto';
import querystring from 'qs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function sortObject(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  let sorted = {};

  let keys = Object.keys(obj).sort();
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];

    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }
  return sorted;
}

export const place_order = catchAsync(async (req, res) => {
  const { products, price, shipping_fee, items, shippingInfo, userId } = req.body;
  const orderId = await orderService.place_order(products, price, shipping_fee, items, shippingInfo, userId);
  res.status(StatusCodes.OK).json({
    message: "Đặt đơn hàng thành công",
    orderId
  })
})

export const get_orders = catchAsync(async (req, res) => {
  const { userId, status } = req.query;
  const orders = await orderService.get_orders(userId, status);
  res.status(StatusCodes.OK).json({
    orders
  })
})

export const get_order_by_id = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.get_order_by_id(orderId);
  res.status(StatusCodes.OK).json({
    order
  })
})

export const get_order_dashboard = catchAsync(async (req, res) => {
  const { userId } = req.params
  const { recentOrders, totalOrder, totalPendingOrder, totalCancelledOrder } = await orderService.get_order_dashboard(userId)
  res.status(StatusCodes.OK).json({
    recentOrders,
    totalOrder,
    totalPendingOrder,
    totalCancelledOrder
  })
})

export const get_admin_orders = catchAsync(async (req, res) => {
  const { searchValue } = req.query;
  const page = parseInt(req.query.page);
  const parPage = parseInt(req.query.parPage);
  const { orders, totalOrders } = await orderService.get_admin_orders(searchValue, page, parPage);
  res.status(StatusCodes.OK).json({
    orders,
    totalOrders
  })
})

export const get_admin_order = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { order } = await orderService.get_admin_order(orderId);
  res.status(StatusCodes.OK).json({
    order
  })
})
export const admin_order_status_update = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  await orderService.admin_order_status_update(orderId, status);
  res.status(StatusCodes.OK).json({
    message: "cập nhật trạng thái đơn hàng thành công"
  })
})

export const get_seller_orders = catchAsync(async (req, res) => {
  const { sellerId } = req.params;
  const { searchValue } = req.query;
  const page = parseInt(req.query.page);
  const parPage = parseInt(req.query.parPage);
  const { orders, totalOrders } = await orderService.get_seller_orders(searchValue, page, parPage, sellerId);
  res.status(StatusCodes.OK).json({
    orders,
    totalOrders
  })
})

export const get_seller_order = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.get_seller_order(orderId);
  res.status(StatusCodes.OK).json({
    order
  })
})

export const seller_order_status_update = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  console.log(status);

  await orderService.seller_order_status_update(orderId, status);
  res.status(StatusCodes.OK).json({
    message: "Cập nhật trạng thái đơn hàng thành công"
  })
})

export const create_payment = async (req, res) => {
  const { totalPrice } = req.body;
  try {
    const exchangeRate = 26000;

    const usd = totalPrice / exchangeRate;

    const payment = await stripe.paymentIntents.create({
      amount: Math.round(usd * 100),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true
      }
    });
    return res.status(StatusCodes.OK).json({ clientSecret: payment.client_secret })
  } catch (error) {
    console.log(error.message)
  }
}

export const order_confirm = async (req, res) => {
  const { orderId } = req.params
  try {
    await CustomerOrder.findByIdAndUpdate(orderId, { payment_status: 'paid' })
    await AuthorOrder.updateMany({ orderId: new mongoose.Types.ObjectId(orderId) }, {
      payment_status: 'paid', delivery_status: 'pending'
    })
    const cuOrder = await CustomerOrder.findById(orderId)

    const auOrder = await AuthorOrder.find({
      orderId: new mongoose.Types.ObjectId(orderId)
    })

    for (let i = 0; i < auOrder.length; i++) {

      const products = auOrder[i].products

      for (let j = 0; j < products.length; j++) {

        await Product.findByIdAndUpdate(
          products[j]._id,
          {
            $inc: {
              stock: -products[j].quantity
            }
          }
        )
      }
    }

    const month = moment().month() + 1
    const year = moment().year()
    await MyShopWallet.create({
      amount: cuOrder.price,
      month: month,
      year: year
    })

    for (let i = 0; i < auOrder.length; i++) {
      await SellerWallet.create({
        sellerId: auOrder[i].sellerId.toString(),
        amount: auOrder[i].price,
        month: month,
        year: year
      })
    }
    return res.status(StatusCodes.OK).json({ message: 'success' })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Lỗi hệ thống' })
  }
}

export const create_vnpay_payment = catchAsync(async (req, res) => {
  const { orderId, amount } = req.body;

  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');

  let ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tmnCode = process.env.VNP_TMNCODE;
  let secretKey = process.env.VNP_HASHSECRET;
  let vnpUrl = process.env.VNP_URL;
  let returnUrl = process.env.VNP_RETURNURL;

  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = 'vn';
  vnp_Params['vnp_CurrCode'] = currCode;
  // Thêm timestamp để tạo mã giao dịch duy nhất cho mỗi lần nhấn thanh toán
  vnp_Params['vnp_TxnRef'] = `${orderId}_${moment().format('HHmmss')}`;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma don hang:' + orderId;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;

  vnp_Params = sortObject(vnp_Params);

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  res.status(StatusCodes.OK).json({ url: vnpUrl });
})

export const vnpay_return = catchAsync(async (req, res) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let secretKey = process.env.VNP_HASHSECRET;
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

  if (secureHash === signed) {
    const vnp_TxnRef = vnp_Params['vnp_TxnRef'];
    // Tách lấy orderId gốc từ chuỗi vnp_TxnRef (lấy phần trước dấu _)
    const orderId = vnp_TxnRef.split('_')[0];
    const responseCode = vnp_Params['vnp_ResponseCode'];

    if (responseCode === "00") {
      // Thanh toán thành công: Cập nhật DB và trừ tồn kho (logic giống order_confirm)
      await CustomerOrder.findByIdAndUpdate(orderId, { payment_status: 'paid' })
      await AuthorOrder.updateMany({ orderId: new mongoose.Types.ObjectId(orderId) }, {
        payment_status: 'paid', delivery_status: 'pending'
      })
      const cuOrder = await CustomerOrder.findById(orderId)
      const auOrder = await AuthorOrder.find({
        orderId: new mongoose.Types.ObjectId(orderId)
      })

      for (let i = 0; i < auOrder.length; i++) {
        const products = auOrder[i].products
        for (let j = 0; j < products.length; j++) {
          await Product.findByIdAndUpdate(
            products[j]._id,
            {
              $inc: { stock: -products[j].quantity }
            }
          )
        }
      }

      const month = moment().month() + 1
      const year = moment().year()
      await MyShopWallet.create({ amount: cuOrder.price, month, year })

      for (let i = 0; i < auOrder.length; i++) {
        await SellerWallet.create({ sellerId: auOrder[i].sellerId.toString(), amount: auOrder[i].price, month, year })
      }
      return res.status(StatusCodes.OK).json({ message: 'Success', code: '00' })
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Fail', code: responseCode })
    }
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid signature', code: '97' })
  }
})
