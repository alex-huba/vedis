const express = require("express");
const { body, param } = require("express-validator");

const homeworkController = require("../controllers/homework.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// used
router.post(
  "/",
  [
    authMiddleware,
    body("studentId").trim().not().isEmpty(),
    body("dueDate").trim().not().isEmpty(),
    body("content").trim().not().isEmpty(),
  ],
  homeworkController.create
);

router.get(
  "/unfinished/amount",
  authMiddleware,
  homeworkController.countUnfinished
);

router.get("/unfinished", authMiddleware, homeworkController.fetchUnfinished);

// used
router.get(
  "/:studentId",
  authMiddleware,
  param("studentId").trim().not().isEmpty(),
  homeworkController.fetchByStudentId
);

// used
router.get("/", authMiddleware, homeworkController.fetchAll);

// used
router.delete(
  "/",
  [authMiddleware, body("id").trim().not().isEmpty()],
  homeworkController.delete
);

router.put(
  "/:id",
  [
    authMiddleware,
    param("id").trim().not().isEmpty(),
    body("done").isBoolean().toBoolean(),
  ],
  homeworkController.updateStatus
);

module.exports = router;
