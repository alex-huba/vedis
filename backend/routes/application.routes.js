const express = require("express");
const { body } = require("express-validator");
const applicationController = require("../controllers/application.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, applicationController.fetchAll);

router.post(
  "/",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .matches(/.*(?:(?!\s|')[a-zA-Zа-яА-ЯїЇіІєЄґҐ']).*/)
      .withMessage("Ім'я містить недопустимі символи або занадто коротке"),
    body("email").trim().isEmail(),
    body("course").trim().not().isEmpty(),
    body("phoneNumber").trim().not().isEmpty(),
    body("howToConnect").trim().not().isEmpty(),
  ],
  applicationController.create
);

router.delete(
  "/",
  [authMiddleware, body("id").trim().not().isEmpty()],
  applicationController.deleteById
);

module.exports = router;
