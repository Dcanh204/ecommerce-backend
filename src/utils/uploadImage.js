// utils/uploadImage.js
import { v2 as cloudinary } from 'cloudinary';
import ApiError from './ApiError.js';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY,
  secure: true,
});

export const uploadImage = async (filePath, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder: folderName });
    return result.url
  } catch (err) {
    throw new ApiError(StatusCodes.CONFLICT, "Tải ảnh thất bại");
  }
};

export const uploadImages = async (files, folderName) => {
  try {
    const results = await Promise.all(
      files.map(file => cloudinary.uploader.upload(file.filepath, { folder: folderName }))
    )
    return results.map(r => r.url);
  } catch (error) {
    throw new ApiError(StatusCodes.CONFLICT, "Tải ảnh thất bại");
  }
}
