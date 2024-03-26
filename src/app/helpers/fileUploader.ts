import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import configs from "../configs";
import fs from "fs";
import { UploadApiResponse } from "cloudinary";

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  cloudinary.config({
    cloud_name: configs.cloudinary_cloud_name,
    api_key: configs.cloudinary_api_key,
    api_secret: configs.cloudinary_api_secret,
  });

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName },

      function (error, result) {
        if (error) reject(error);
        resolve(result as UploadApiResponse);
        fs.unlink(path, err => {
          if (err) {
            reject(err);
            return;
          }
        });
      },
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname);
  },
});

export const upload = multer({ storage: storage });
