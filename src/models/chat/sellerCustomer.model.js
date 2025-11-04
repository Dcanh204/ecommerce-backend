import { Schema, model } from 'mongoose';

const sellerCustomerSchema = new Schema({
  myId: {
    type: String,
    required: true
  },
  myFriends: {
    type: Array,
    default: []
  }
}, { timestamps: true });

const SellerCustomer = model("seller_customer", sellerCustomerSchema);
export default SellerCustomer;