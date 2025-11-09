import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import Category from './../models/category.model.js';
import { slugify } from '../utils/slugify.js';
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

  // get category
  async getCategory(parpage, page, searchValue) {
    const skipPage = parseInt(parpage) * (parseInt(page) - 1);

    const query = searchValue && searchValue !== '' ? { $text: { $search: searchValue } } : {};

    const [categories, totalCategories] = await Promise.all([
      Category.find(query).skip(skipPage).limit(parseInt(parpage)).sort({ createdAt: -1 }),
      Category.countDocuments(query)
    ]);
    return { categories, totalCategories };
  }

  // update category
  async updateCategory(id, category_name, imageUrl) {
    const existing = await Category.findOne({
      category_name,
    });
    if (existing) {
      throw new ApiError(StatusCodes.CONFLICT, "Tên danh mục đã tồn tại");
    }
    const slug = slugify(category_name);
    const updateData = {
      category_name,
      slug
    }
    if (imageUrl) {
      updateData.image = imageUrl;
    }
    const updateCategory = Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    return updateCategory;
  }
}

export default new CategoryService;