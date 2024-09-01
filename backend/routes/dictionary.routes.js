const express = require("express");
const { body } = require("express-validator");

const dictionaryController = require("../controllers/dictionary.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Add a new word to the dictionary
router.post(
  "/",
  [
    authMiddleware,
    body("studentId").trim().not().isEmpty(),
    body("date").trim().not().isEmpty(),
    body("word").trim().not().isEmpty(),
    body("transcription").trim().not().isEmpty(),
    body("translation").trim().not().isEmpty(),
  ],
  dictionaryController.addNewWord
);

// Get dictionary by studentId
router.get(
  "/:studentId",
  authMiddleware,
  dictionaryController.getDictionaryById
);

// Get the whole dictionary
router.get("/", authMiddleware, dictionaryController.getWholeDictionary);

// Delete word from dictionary
router.delete(
  "/",
  [authMiddleware, body("id").trim().not().isEmpty()],
  dictionaryController.deleteWord
);

module.exports = router;
