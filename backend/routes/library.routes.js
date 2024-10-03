const express = require("express");
const libraryController = require("../controllers/library.controller");
const authMiddleware = require("../middleware/auth.middleware");
const uploadFileMiddleware = require("../middleware/uploadFile.middleware");

const router = express.Router();

// used
router.get("/", authMiddleware, libraryController.countFilesPerStudent);

// used
router.get("/:studentId/:fileName", libraryController.getFile);

// used
router.get("/:studentId", authMiddleware, libraryController.getAllFilenames);

// used
router.post(
  "/:studentId",
  [authMiddleware, uploadFileMiddleware.single("file")],
  libraryController.uploadFile
);

// used
router.delete(
  "/:studentId/:fileName",
  authMiddleware,
  libraryController.deleteFile
);

module.exports = router;
