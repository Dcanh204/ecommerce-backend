import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import { parseForm } from "../../utils/formidable.js";
import { uploadImages } from "../../utils/uploadImage.js";
import productService from "../../service/product.service.js";

export const addProduct = catchAsync(async (req, res) => {
  const { id } = req;
  const { fields, files } = await parseForm(req, true);
  const name = fields.name?.[0].trim();
  const brand = fields.brand?.[0].trim();
  const price = parseInt(fields.price?.[0]);
  const discount = parseInt(fields.discount?.[0]) || 0
  const description = fields.description?.[0].trim() || ""
  const stock = parseInt(fields.stock?.[0]);
  const category = fields.category?.[0].trim();
  const shopName = fields.shopName?.[0].trim();
  const image = files.images?.[0];
  if (!name || !brand || !price || !stock || !category || !image) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Vui lòng nhập đầy đủ thông tin" })
  }

  const images = await uploadImages(files.images, "products");

  const product = await productService.addProduct({ id, name, brand, price, discount, description, stock, category, shopName, images });

  res.status(StatusCodes.CREATED).json({
    message: "Thêm sản phẩm thành công",
    product
  })

})

export const getProduct = catchAsync(async (req, res) => {
  const { id } = req;
  const { page, parPage, searchValue } = req.query;
  const { products, totalProduct } = await productService.getProduct(id, page, parPage, searchValue);
  res.status(StatusCodes.OK).json({
    products,
    totalProduct
  })
})