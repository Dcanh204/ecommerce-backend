import { StatusCodes } from 'http-status-codes';
import Cart from './../../models/cart.model.js';
import ApiError from './../../utils/ApiError.js';
import mongoose from 'mongoose';
import WishList from '../../models/wishlist.model.js';
class CartService {
  async add_to_cart(userId, quantity, productId) {
    const getCart = await Cart.findOne({ userId, productId })
    if (getCart) {
      throw new ApiError(StatusCodes.CONFLICT, "Sản phẩm đã có trong giỏ hàng")
    }
    const cart = await Cart.create({
      userId,
      quantity,
      productId
    })
    return cart
  }

  async get_cart_product(userId) {
    const cart_products = await Cart.aggregate([
      { $match: { userId: mongoose.Types.ObjectId.createFromHexString(userId) } },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'products'
        }
      }
    ]);

    let buy_product_item = 0;
    let calculatePrice = 0;
    let cart_product_count = 0;

    const outOfStockProduct = cart_products.filter(product => product.products[0].stock < product.quantity);
    for (let i = 0; i < outOfStockProduct.length; i++) {
      cart_product_count += outOfStockProduct[i].quantity;
    }

    const stock_product = cart_products.filter(product => product.products[0].stock >= product.quantity);
    for (let i = 0; i < stock_product.length; i++) {
      const { quantity } = stock_product[i];
      cart_product_count = buy_product_item + quantity

      buy_product_item += quantity;

      const { price, discount } = stock_product[i].products[0];
      if (discount !== 0) {
        const priceAfterDiscount = price - (price * discount) / 100;
        calculatePrice += Math.floor(quantity * priceAfterDiscount / 1000) * 1000;
      } else {
        calculatePrice += quantity * price;
      }
    }

    let p = [];
    let unique = [...new Set(stock_product.map(p => p.products[0].sellerId.toString()))];

    for (let i = 0; i < unique.length; i++) {
      let price = 0;
      for (let j = 0; j < stock_product.length; j++) {
        const tempProduct = stock_product[j].products[0];
        const quantity = stock_product[j].quantity;
        if (unique[i] === tempProduct.sellerId.toString()) {
          let pri = 0;
          if (tempProduct.discount !== 0) {
            const priceAfterDiscount = tempProduct.price - (tempProduct.price * tempProduct.discount) / 100;
            pri = Math.floor(priceAfterDiscount * quantity / 1000) * 1000;
          } else {
            pri = tempProduct.price * quantity;
          }

          price += pri;

          p[i] = {
            sellerId: unique[i],
            shopName: tempProduct.shopName,
            price,
            products: p[i] ? [
              ...p[i].products,
              {
                _id: stock_product[j]._id,
                quantity,
                productInfo: tempProduct
              }
            ] : [
              {
                _id: stock_product[j]._id,
                quantity,
                productInfo: tempProduct
              }
            ]
          };
        }
      }
    }
    return {
      cart_products: p,
      price: calculatePrice,
      cart_product_count,
      shipping_fee: 20000 * p.length,
      outOfStockProduct,
      buy_product_item
    }
  }

  async delete_cart_product(cart_id) {
    await Cart.findOneAndDelete(cart_id);
  }

  async quantity_inc(cartId) {
    const product = await Cart.findById(cartId);
    const { quantity } = product;
    await Cart.findByIdAndUpdate(cartId, { quantity: quantity + 1 })
  }
  async quantity_dec(cartId) {
    const product = await Cart.findById(cartId);
    const { quantity } = product;
    await Cart.findByIdAndUpdate(cartId, { quantity: quantity - 1 })
  }

  async add_wishlist(userId, productId, name, price, image, discount, rating, slug) {
    const product = await WishList.findOne({ slug });
    if (product) {
      throw new ApiError(StatusCodes.CONFLICT, "Sản phẩm đã có trong yêu thích")
    }
    await WishList.create({
      userId,
      name,
      productId,
      price,
      rating,
      slug,
      discount,
      image
    })
  }

  async get_wishlist(userId) {
    const wishlist_products = await WishList.find({ userId });
    return {
      wishlist_products,
      wishlistCount: wishlist_products.length
    }
  }

  async remove_wishlist(wishlistId) {
    await WishList.findByIdAndDelete(wishlistId);
  }
}

export default new CartService;