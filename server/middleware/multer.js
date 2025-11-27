import multer from "multer";

// Multer setup for handling file uploads
const upload = multer({
  storage: multer.diskStorage({}) // Use default disk storage
});

export default upload;
