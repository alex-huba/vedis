const express = require("express");
const { body } = require("express-validator");

const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, postController.fetchAll);

router.post(
  "/",
  [
    authMiddleware,
    body("title").trim().isLength({ min: 5 }).not().isEmpty(),
    body("body").trim().isLength({ min: 10 }).not().isEmpty(),
    body("user").trim().not().isEmpty(),
  ],
  postController.save
);

router.delete("/:id", authMiddleware, postController.delete);

module.exports = router;
