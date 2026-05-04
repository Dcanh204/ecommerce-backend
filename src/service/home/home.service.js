import { StatusCodes } from "http-status-codes";
import Category from "../../models/category.model.js";
import Product from './../../models/product.model.js';
import ApiError from './../../utils/ApiError.js';
import Review from "../../models/review.model.js";
import mongoose from "mongoose";

class HomeService {
  async getCategory() {
    const categories = await Category.find();
    return categories;
  }
  formatProducts(products) {
    const productArray = [];
    let i = 0;
    while (i < products.length) {
      let temp = [];
      let j = i;
      while (j < i + 3) {
        if (products[j]) {
          temp.push(products[j])
        }
        j++;
      }
      productArray.push([...temp]);
      i = j;
    }
    return productArray
  }

  // get products
  async getProduct() {
    const [products, latest, topRate, discount] = await Promise.all([
      Product.find().limit(18).sort({ createdAt: -1 }),
      Product.find().limit(9).sort({ createdAt: -1 }),
      Product.find({ rating: { $gt: 0 } }).limit(9).sort({ rating: -1 }),
      Product.find({ discount: { $gt: 0 } }).limit(9).sort({ discount: -1 }),
    ])


    return {
      products,
      latest_product: this.formatProducts(latest),
      topRate_product: this.formatProducts(topRate),
      discount_product: this.formatProducts(discount),
    }
  }


  // query product
  async query_products(lowPrice, highPrice, category, rating, sortPrice, pageNumber, limit, searchValue) {
    const filter = {
      price: { $gte: Number(lowPrice), $lte: Number(highPrice) }
    };
    if (category) filter.category = category;
    if (rating !== '') {
      const r = Number(rating);
      if (r < 5) {
        filter.rating = { $gte: r, $lt: r + 1 };
      } else {
        filter.rating = 5;
      }
    }
    if (searchValue && searchValue.trim() !== '') {
      filter.$or = [
        { name: { $regex: searchValue, $options: 'i' } },
        { category: { $regex: searchValue, $options: 'i' } }
      ];
    }
    const sort = {}
    if (sortPrice === 'low-to-high') sort.price = 1
    if (sortPrice === 'high-to-low') sort.price = -1

    const page = Number(pageNumber);
    const parPage = Number(limit)
    const skip = parPage * (page - 1);

    const [products, totalProduct] = await Promise.all([
      await Product.find(filter).skip(skip).limit(parPage).sort(sort),
      await Product.countDocuments(filter)
    ])
    return {
      products,
      totalProduct,
      parPage
    }
  }

  async product_details(slug) {
    const product = await Product.findOne({ slug });
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, "Sản phẩm không tồn tại");

    const [relatedProducts, fromStore] = await Promise.all([
      Product.find({ _id: { $ne: product._id }, category: product.category }).limit(12),
      Product.find({ _id: { $ne: product._id }, sellerId: product.sellerId }).limit(3)
    ])
    return {
      product,
      relatedProducts,
      fromStore
    }
  }

  async product_review(name, review, rating, productId) {
    await Review.create({
      productId,
      name,
      rating,
      review,
      date: Date.now()
    })
    let rat = 0;
    const reviews = await Review.find({ productId });
    for (let i = 0; i < reviews.length; i++) {
      rat = rat + reviews[i].rating
    }
    let productRating = 0;
    if (reviews.length !== 0) {
      productRating = (rat / reviews.length).toFixed(1)
    }

    await Product.findByIdAndUpdate(productId, {
      rating: productRating
    })
  }

  async get_reviews(productId, page) {
    const limit = 5;
    const skipPage = limit * (page - 1);
    const getRating = await Review.aggregate([
      {
        $match: { productId: mongoose.Types.ObjectId.createFromHexString(productId) }
      },
      {
        $group: {
          _id: "$rating",
          count: {
            $sum: 1
          }
        }
      }
    ])

    let rating_reviews = [
      { rating: 5, sum: 0 },
      { rating: 4, sum: 0 },
      { rating: 3, sum: 0 },
      { rating: 2, sum: 0 },
      { rating: 1, sum: 0 },
    ]

    for (let i = 0; i < rating_reviews.length; i++) {
      for (let j = 0; j < getRating.length; j++) {
        if (rating_reviews[i].rating === getRating[j]._id) {
          rating_reviews[i].sum = getRating[j].count;
          break;
        }

      }
    }

    const [totalReview, reviews] = await Promise.all([
      Review.countDocuments({ productId }),
      Review.find({ productId }).skip(skipPage).limit(limit).sort({ createdAt: -1 })
    ])

    return {
      totalReview,
      reviews,
      rating_reviews
    }
  }
}

export default new HomeService;