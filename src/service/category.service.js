import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import Category from './../models/category.model.js';
class CategoryService {
  async addCategory(category_name, image, slug) {
    const existingCategory = await Category.findOne({
      $or: [
        { category_name: category_name.trim() },
        { slug }
      ]
    })
    if (existingCategory) {
      throw new ApiError(StatusCodes.CONFLICT, "Danh mục đã tồn tại")
    }
    const category = await Category.create({
      category_name,
      image,
      slug
    })
    return category;
  }
}

export default new CategoryService;