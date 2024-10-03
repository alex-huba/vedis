const multer = require("multer");
const path = require("path");

// Setup storage for profile photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const id = req.userId;

    if (!id) {
      return cb(new Error("ID is required to name the file"));
    }

    // Use the id to name the file with the same extension
    cb(null, `${id}${path.extname(file.originalname)}`);
  },
});

// Initialize multer with the storage config
const uploadAvatarMiddleware = multer({ storage: storage });
module.exports = uploadAvatarMiddleware;
