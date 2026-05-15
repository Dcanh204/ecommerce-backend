import { Schema, model } from 'mongoose'

const authorOrderSchema = new Schema({
  orderId: {
    type: Schema.ObjectId,
    required: true
  },
  sellerId: {
    type: Schema.ObjectId,
    required: true
  },
  products: {
    type: Array,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    required: true
  },
  shippingInfo: {
    type: Object,
    required: true
  },
  delivery_status: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
}, { timestamps: true });
const AuthorOrder = model('AuthorOrder', authorOrderSchema);

export default AuthorOrder;