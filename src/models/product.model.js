import { Schema, model } from "mongoose";

const productSchema = new Schema({
  sellerId: {
    type: Schema.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: false,
  },
  shopName: {
    type: String,
    required: false,
  },
  images: {
    type: Array,
    required: false,
  },
  rating: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

productSchema.index({
  name: 'text',
  category: 'text',
  brand: 'text',
  description: 'text'
}, {
  weights: {
    name: 5,
    category: 4,
    brand: 3,
    description: 2
  }
})

const Product = model('Product', productSchema);

export default Product;