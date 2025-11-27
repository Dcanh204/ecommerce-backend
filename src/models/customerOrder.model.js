import { Schema, model } from 'mongoose'

const CustomerOrderSchema = new Schema({
  customerId: {
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
  delivery_status: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
}, { timestamps: true });
const CustomerOrder = model('CustomerOrder', CustomerOrderSchema);

export default CustomerOrder;