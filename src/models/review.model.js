import { Schema, model } from "mongoose";

const ReviewSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  review: {
    type: String,
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

const Review = model('Review', ReviewSchema)

export default Review;