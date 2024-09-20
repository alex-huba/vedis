const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user.model");
const authController = require("../controllers/auth.controller");

const router = express.Router();

const emailValidator = async (email) => {
  const user = await User.findByEmail(email);
  if (user[0].length > 0) {
    return Promise.reject("На цю адресу вже зареєстровано профіль");
  }
};

router.post(
  "/signup",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Ім'я має бути мінімум 2 символи завдовжки")
      .matches(/.*(?:(?!\s|')[a-zA-Zа-яА-ЯїЇіІєЄґҐ']).*/)
      .withMessage("Ім'я містить недопустимі символи"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Некоректна електронна пошта")
      .custom(emailValidator),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Пароль має містити мінімум 8 символів")
      .matches(/^(?=.*[A-Za-z])(?=.*[\d!@#_$%^&*])/)
      .withMessage(
        "Пароль має містити мінімум одну букву, одне число та один спеціальний символ"
      ),
    body("phone")
      .trim()
      .matches(/^\+(?:[0-9] ?){6,14}[0-9]$/)
      .withMessage("Недопустимий номер телефону"),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Некоректна електронна пошта"),
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

router.post("/verifyToken", authController.verifyToken);

module.exports = router;
