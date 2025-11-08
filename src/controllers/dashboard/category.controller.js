
import catchAsync from "../../utils/catchAsync.js";
import { StatusCodes } from 'http-status-codes';
import { parseForm } from "../../utils/formidable.js";
import { slugify } from "../../utils/slugify.js";
import { uploadImage } from "../../utils/uploadImage.js";
import categoryService from "../../service/category.service.js";


export const addCategory = catchAsync(async (req, res) => {
  const { fields, files } = await parseForm(req);
  let category_name = fields.category_name?.[0].trim();
  let image = files.image[0];
  const imageUrrl = await uploadImage(image.filepath, 'categories');
  if (!category_name || !image) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Vui lòng nhập đầy đủ dữ liệu" });
  }
  const slug = slugify(category_name);
  const category = await categoryService.addCategory(category_name, imageUrrl, slug);
  res.status(StatusCodes.CREATED).json({
    message: "Thêm danh mục thành công",
    category
  })


})