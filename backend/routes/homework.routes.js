const express = require("express");
const { body, param } = require("express-validator");

const homeworkController = require("../controllers/homework.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  [
    authMiddleware,
    body("studentId").trim().notEmpty(),
    body("dueDate").trim().notEmpty(),
    body("content").trim().notEmpty(),
  ],
  homeworkController.create
);

router.get(
  "/unfinished/amount/:userId",
  [authMiddleware, param("userId").trim().notEmpty()],
  homeworkController.countUnfinished
);

router.get("/unfinished", authMiddleware, homeworkController.fetchUnfinished);

router.get(
  "/:studentId",
  [authMiddleware, param("studentId").trim().notEmpty()],
  homeworkController.fetchByStudentId
);

router.get("/", authMiddleware, homeworkController.fetchAll);

router.delete(
  "/",
  [authMiddleware, body("id").trim().notEmpty()],
  homeworkController.delete
);

router.put(
  "/:id",
  [
    authMiddleware,
    param("id").trim().notEmpty(),
    body("done").isBoolean().toBoolean(),
  ],
  homeworkController.updateStatus
);

module.exports = router;
