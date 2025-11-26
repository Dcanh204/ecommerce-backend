import { Schema, model } from "mongoose";

const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, ref: 'User'
  },
  productId: {
    type: Schema.Types.ObjectId, ref: 'Product'
  },
  quantity: {
    type: Number,
    required: true
  },

}, { timestamps: true });

const Cart = model('Cart', CartSchema)

export default Cart;