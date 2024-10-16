const express = require("express");
const { body } = require("express-validator");
const applicationController = require("../controllers/application.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, applicationController.fetchAll);

router.get(
  "/amount",
  authMiddleware,
  applicationController.fetchNumberOfApplications
);

router.post(
  "/",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .matches(/.*(?:(?!\s|')[a-zA-Zа-яА-ЯїЇіІєЄґҐ']).*/)
      .withMessage("Ім'я містить недопустимі символи або занадто коротке"),
    body("email").trim().isEmail(),
    body("course").trim().notEmpty(),
    body("phoneNumber").trim().notEmpty(),
    body("howToConnect").trim().notEmpty(),
  ],
  applicationController.create
);

router.delete(
  "/",
  [authMiddleware, body("email").trim().isEmail()],
  applicationController.deleteByEmail
);

module.exports = router;
