import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Env } from "./env.config.js";

export const CLOUDINARY_FOLDER = Env.CLOUDINARY_FOLDER;

cloudinary.config({
  cloud_name: Env.CLOUDINARY_CLOUD_NAME,
  api_key: Env.CLOUDINARY_API_KEY,
  api_secret: Env.CLOUDINARY_API_SECRET,
});

const STORAGE_PARAMS = {
  folder: CLOUDINARY_FOLDER,
  allowed_formats: ["jpg", "png", "jpeg"],
  resource_type: "image",
  quality: "auto:good",
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    ...STORAGE_PARAMS,
  }),
});

// Main upload for multiple files (gigs)
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5, // Allow up to 5 files for gigs
  },
  fileFilter: (req, file, cb) => {
    const isValid = /^image\/(jpe?g|png)$/.test(file.mimetype);
    if (!isValid) {
      return cb(new Error("Only JPEG and PNG files are allowed"), false);
    }
    cb(null, true);
  },
});

export const uploadSingle = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const isValid = /^image\/(jpe?g|png)$/.test(file.mimetype);
    if (!isValid) {
      return cb(new Error("Only JPEG and PNG files are allowed"), false);
    }
    cb(null, true);
  },
});

const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: CLOUDINARY_FOLDER + "_docs",
    resource_type: "raw", 
  },
});

export const uploadDocument = multer({
  storage: documentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1,
  },
});

export { cloudinary };
