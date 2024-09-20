const express = require("express");
const { body, param } = require("express-validator");

const dictionaryController = require("../controllers/dictionary.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  [
    authMiddleware,
    body("studentId").trim().not().isEmpty(),
    body("word").trim().not().isEmpty(),
    body("transcription").trim().not().isEmpty(),
    body("translation").trim().not().isEmpty(),
  ],
  dictionaryController.create
);

router.get(
  "/:studentId",
  authMiddleware,
  param("studentId").trim().not().isEmpty(),
  dictionaryController.fetchByStudentId
);

router.get("/", authMiddleware, dictionaryController.fetchAll);

router.delete(
  "/",
  [authMiddleware, body("id").trim().not().isEmpty()],
  dictionaryController.delete
);

module.exports = router;
