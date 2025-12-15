import { Schema, model } from 'mongoose'

const WishListSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: true
  },
  productId: {
    type: Schema.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },

}, { timestamps: true });
const WishList = model('WishList', WishListSchema);

export default WishList;