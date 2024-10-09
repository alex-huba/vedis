const express = require("express");
const { body, param } = require("express-validator");

const dictionaryController = require("../controllers/dictionary.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  [
    authMiddleware,
    body("studentId").trim().notEmpty(),
    body("dueDate").trim().notEmpty(),
    body("word").trim().notEmpty(),
    body("transcription").trim().notEmpty(),
    body("translation").trim().notEmpty(),
  ],
  dictionaryController.create
);

router.get(
  "/amount/:studentId",
  [authMiddleware, param("studentId").trim().notEmpty()],
  dictionaryController.fetchAmountByStudentId
);

router.get(
  "/:studentId",
  [authMiddleware, param("studentId").trim().notEmpty()],
  dictionaryController.fetchByStudentId
);

router.get("/", authMiddleware, dictionaryController.fetchAll);

router.delete(
  "/",
  [authMiddleware, body("id").trim().notEmpty()],
  dictionaryController.delete
);

module.exports = router;
