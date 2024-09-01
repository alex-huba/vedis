const express = require("express");
const { body } = require("express-validator");

const homeworkController = require("../controllers/homework.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Create a new homework
router.post(
  "/",
  [
    authMiddleware,
    body("studentId").trim().not().isEmpty(),
    body("date").trim().not().isEmpty(),
    body("status").trim().not().isEmpty(),
    body("content").trim().not().isEmpty(),
  ],
  homeworkController.createHomework
);

// Get homework by studentId
router.get("/:studentId", authMiddleware, homeworkController.getHomeworkById);

// Get all homework
router.get("/", authMiddleware, homeworkController.getAllHomework);

router.delete(
  "/",
  [authMiddleware, body("id").trim().not().isEmpty()],
  homeworkController.deleteHomework
);

router.put(
  "/:id",
  [authMiddleware, body("status").trim().not().isEmpty()],
  homeworkController.updateHomeworkStatus
);

module.exports = router;
