import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { s3 } from "../config/s3Config.js";

const s3Storage = multerS3({
  s3: s3, // s3 instance
  bucket: "trackproject", // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
    cb(null, {
      fieldname: file.fieldname,
      ContentDisposition: "inline",
      ContentType: file.mimetype,
    });
  },
  key: (req, file, cb) => {
    const fileName =
      Date.now() + "_" + file.fieldname + "_" + file.originalname;
      const sanitizedFileName = fileName.replace(/\s+/g, '_'); // Replace spaces with underscores
  cb(null, sanitizedFileName);
  },
});

// function to sanitize files and send error for unsupported files
function sanitizeFile(file, cb) {
  // Define the allowed extension
  const fileExts = [".png", ".jpg", ".jpeg", ".gif", "webp"];

  // Check allowed extensions
  const isAllowedExt = fileExts.includes(
    path.extname(file.originalname.toLowerCase())
  );

  // Mime type must be an image
  const isAllowedMimeType = file.mimetype.startsWith("image/");

  if (isAllowedExt && isAllowedMimeType) {
    return cb(null, true); // no errors
  } else {
    // pass error msg to callback, which can be displaye in frontend
    cb("Error: File type not allowed!");
  }
}

const uploadImage = multer({
  storage: s3Storage,
  fileFilter: (req, file, callback) => {
    sanitizeFile(file, callback);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

export { uploadImage };
