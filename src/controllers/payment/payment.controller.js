import { StatusCodes } from "http-status-codes";
import catchAsync from '../../utils/catchAsync.js';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
import StripeModel from "../../models/stripe.model.js";
import Seller from "../../models/seller.model.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const create_stripe_connect_account = catchAsync(async (req, res) => {
  const { id } = req;
  const uid = uuidv4();
  try {
    const stripeInfo = await StripeModel.findOne({ sellerId: id })

    if (stripeInfo) {
      await StripeModel.deleteOne({ sellerId: id })
      const account = await stripe.accounts.create({ type: 'express' })

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'http://localhost:4000/refresh',
        return_url: `http://localhost:4000/success?activeCode=${uid}`,
        type: 'account_onboarding'
      })
      await StripeModel.create({
        sellerId: id,
        stripeId: account.id,
        code: uid
      })
      res.status(StatusCodes.CREATED).json({ url: accountLink.url })

    } else {
      const account = await stripe.accounts.create({ type: 'express' })

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'http://localhost:4000/refresh',
        return_url: `http://localhost:4000/success?activeCode=${uid}`,
        type: 'account_onboarding'
      })
      await StripeModel.create({
        sellerId: id,
        stripeId: account.id,
        code: uid
      })
      res.status(StatusCodes.CREATED).json({ url: accountLink.url })

    }

  } catch (error) {
    console.log('strpe connect account errror' + error.message)
  }
})


export const active_stripe_connect_account = catchAsync(async (req, res) => {
  const { activeCode } = req.params;
  const { id } = req;
  try {
    const stripeUserInfo = await StripeModel.findOne({ code: activeCode })
    if (stripeUserInfo) {
      await Seller.findByIdAndUpdate(id, { payment: 'active' })
      return res.status(StatusCodes.OK).json({ message: "Liên kết tài khoản ngân hàng thành công" })
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Lỗi liên kết ngân hàng" })
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "INTERNAL SERVER ERROR" })
  }

})

