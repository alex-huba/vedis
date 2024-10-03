const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Setup storage for learning materials
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.role != "teacher") return cb(new Error("Unauthorized"));

    const userId = req.params.studentId;

    if (!userId) {
      return cb(
        new Error("User ID is required to determine the upload folder")
      );
    }

    // Define the folder path
    const userFolder = path.join(__dirname, "../uploads", userId.toString());

    // Check if the folder exists, if not, create it
    fs.mkdir(userFolder, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, userFolder); // Use the created folder as the destination
    });
  },
  filename: function (req, file, cb) {
    // Save the file with its original name
    cb(null, file.originalname);
  },
});

// Initialize multer with the storage config
const uploadFileMiddleware = multer({ storage: storage });
module.exports = uploadFileMiddleware;
