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
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
