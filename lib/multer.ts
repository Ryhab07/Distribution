import multer from 'multer';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(process.cwd(), 'uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueID = uuidv4(); // Generate a unique pieceId
    const originalName = file.originalname;
    cb(null, `${uniqueID}_${originalName}`);
  }
});

const upload = multer({ storage: storage });

export default upload;
