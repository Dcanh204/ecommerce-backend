
import catchAsync from "../../utils/catchAsync.js";
import { StatusCodes } from 'http-status-codes';
import { parseForm } from "../../utils/formidable.js";
import { slugify } from "../../utils/slugify.js";
import { uploadImage } from "../../utils/uploadImage.js";
import categoryService from "../../service/category.service.js";
import Category from "../../models/category.model.js";


export const addCategory = catchAsync(async (req, res) => {
  const { fields, files } = await parseForm(req, false);
  let category_name = fields.category_name?.[0]?.trim();
  let image = files.image?.[0];
  if (!category_name || !image) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Vui lòng nhập đầy đủ dữ liệu" });
  }
  const imageUrl = await uploadImage(image.filepath, 'categories');
  const slug = slugify(category_name);
  const category = await categoryService.addCategory(category_name, imageUrl, slug);
  res.status(StatusCodes.CREATED).json({
    message: "Thêm danh mục thành công",
    category
  })
})

export const getCategory = catchAsync(async (req, res) => {
  const { page, searchValue, parPage } = req.query;
  const { categories, totalCategories } = await categoryService.getCategory(parPage, page, searchValue);
  res.status(StatusCodes.OK).json({
    categories,
    totalCategories,
  })
})

export const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { fields, files } = await parseForm(req, false);
  const category_name = fields.category_name?.[0]?.trim();
  const image = files.image?.[0];
  if (!category_name) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Vui lòng nhập đầy đủ dữ liệu" });
  }
  let imageUrl = null;
  if (image) {
    imageUrl = await uploadImage(image.filepath, 'categories');
  }
  const category = await categoryService.updateCategory(id, category_name, imageUrl);
  res.status(StatusCodes.OK).json({
    message: "Cập nhật danh mục thành công",
    category
  })
})

export const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  await categoryService.deleteCategory(id);
  res.status(StatusCodes.OK).json({
    message: "Xóa danh mục thành công",
    id
  })
})