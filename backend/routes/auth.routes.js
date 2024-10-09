const express = require("express");
const { body, param } = require("express-validator");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/signup",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Ім'я має бути мінімум 2 символи завдовжки")
      .matches(/.*(?:(?!\s|')[a-zA-Zа-яА-ЯїЇіІєЄґҐ']).*/)
      .withMessage("Ім'я містить недопустимі символи"),
    body("email").isEmail().withMessage("Некоректна електронна пошта"),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Пароль має містити мінімум 8 символів")
      .matches(/^(?=.*[A-Za-z])(?=.*[\d!@#_$%^&*])/)
      .withMessage(
        "Пароль має містити мінімум одну букву, одне число та один спеціальний символ"
      ),
    body("phoneNumber")
      .trim()
      .matches(/^\+(?:[0-9] ?){6,14}[0-9]$/)
      .withMessage("Недопустимий номер телефону"),
    body("timezone").trim().notEmpty().withMessage("Некоректний часовий пояс"),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Email недійсний"),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Пароль має містити мінімум 8 символів")
      .matches(/^(?=.*[A-Za-z])(?=.*[\d!@#_$%^&*])/)
      .withMessage(
        "Пароль має містити мінімум одну букву, одне число та один спеціальний символ"
      ),
  ],
  authController.login
);

router.post(
  "/verification",
  body("token").notEmpty(),
  authController.verifyToken
);

router.post(
  "/forgot/password",
  body("email").isEmail(),
  authController.generateLink
);

router.post(
  "/reset/password/:id/:token",
  [
    param("id").notEmpty(),
    param("token").notEmpty(),
    body("password").notEmpty(),
  ],
  authController.resetPassword
);

router.put(
  "/change/password/:userId",
  [
    authMiddleware,
    param("userId").trim().notEmpty(),
    body("password").trim().notEmpty(),
  ],
  authController.changePassword
);

module.exports = router;
