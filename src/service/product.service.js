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
  // get product
  async getProduct(id, page, parPage, searchValue) {
    let skipPage = 0;
    if (page && parPage) {
      skipPage = parseInt(parPage) * (parseInt(page) - 1);
    }

    const query = {
      sellerId: id,
      ... (searchValue && searchValue.trim() !== '' ? { $text: { $search: searchValue } } : {})
    }

    const [products, totalProduct] = await Promise.all([
      Product.find(query).skip(skipPage).limit(parPage).sort({ createdAt: -1 }),
      Product.countDocuments(query)
    ])
    return { products, totalProduct }
  }
  async getProductById(id) {
    const product = await Product.findById(id);
    return product;
  }

  // update
  async updateProduct(id, name, brand, price, discount, description, stock, category) {
    const slug = slugify(name);
    const product = await Product.findByIdAndUpdate(id, {
      name,
      brand,
      price,
      discount,
      description,
      stock,
      category,
      slug
    }, { new: true });
    return product;
  }
  // update image
  async updateImage(id, oldImage, newImageUrl) {
    let { images } = await Product.findById(id);
    const index = images.findIndex(img => img.trim() === oldImage.trim());
    images[index] = newImageUrl;
    const product = await Product.findByIdAndUpdate(id, {
      images
    }, { new: true });
    return product;
  }

  async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại');
    }
  }
}

export default new ProductService;