
import multer from 'multer';
import path from 'path';
// Storage: temporarily saves uploaded file before processing
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Keep original name (sanitize later in controller)
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedExts = ['.jpg', '.jpeg', '.png', '.jfif', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files with .jpg, .jpeg, .png, .jfif, .webp are allowed!'));
  }
};


const upload = multer({ storage, fileFilter });

export default upload;

