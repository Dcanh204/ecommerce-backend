import { StatusCodes } from "http-status-codes";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import { slugify } from "../utils/slugify.js";

class ProductService {
  // add product
  async addProduct({ id, name, brand, price, discount, description, stock, category, shopName, images }) {
    const slug = slugify(name);
    const existingProduct = await Product.findOne({ slug, sellerId: id });
    if (existingProduct) {
      throw new ApiError(StatusCodes.CONFLICT, "Sản phẩm này đã tồn tại");
    }

    const product = await Product.create({
      sellerId: id,
      name,
      brand,
      price,
      discount,
      description,
      slug,
      stock,
      category,
      shopName,
      images
    })
    return product
  }
}

export default new ProductService;