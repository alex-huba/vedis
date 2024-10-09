const express = require("express");
const libraryController = require("../controllers/library.controller");
const authMiddleware = require("../middleware/auth.middleware");
const uploadFileMiddleware = require("../middleware/uploadFile.middleware");

const router = express.Router();

router.get("/", authMiddleware, libraryController.countFilesPerStudent);

router.get("/:studentId/:fileName", libraryController.getFile);

router.get("/:studentId", authMiddleware, libraryController.getAllFilenames);

router.post(
  "/:studentId",
  [authMiddleware, uploadFileMiddleware.single("file")],
  libraryController.uploadFile
);

router.delete(
  "/:studentId/:fileName",
  authMiddleware,
  libraryController.deleteFile
);

module.exports = router;
