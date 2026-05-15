import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
        folder: "products",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 1000, height: 1000, crop: "limit" }]
    })
});

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIMES.includes(file.mimetype)) {
            cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, WebP, AVIF allowed.`));
            return;
        }
        cb(null, true);
    },
    limits: { fileSize: MAX_FILE_SIZE }
});

export const uploadProductImages = upload.array("images", 5);
