const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/authController");

const router = express.Router();

const nameValidator = (value) => {
  if (!value.trim()) {
    throw new Error("Name cannot be empty or consist only of spaces");
  }
  if (value.trim().length < 2) {
    throw new Error("Name must be at least 2 characters long");
  }
  if (!value.match(/.*(?:(?!\s|')[a-zA-Zа-яА-ЯїЇіІєЄґҐ']).*/)) {
    throw new Error(
      "Name must contain at least one non-space character and one letter"
    );
  }
  return true;
};

const phoneNumberValidator = (value) => {
  const phoneNumberRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  if (!value.match(phoneNumberRegex)) {
    throw new Error(
      "Please enter a valid phone number in international format."
    );
  }
  return true;
};

const emailValidator = async (email) => {
  const user = await User.findByEmail(email);
  if (user[0].length > 0) {
    return Promise.reject("Email address already exist");
  }
};

router.post(
  "/signup",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must contain at least 2 chars")
      .custom(nameValidator),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email.")
      .isLength({ min: 5 })
      .withMessage("Email must be at least 5 characters long.")
      .custom(emailValidator)
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .matches(/^(?=.*[A-Za-z])(?=.*[\d!@#_$%^&*])/)
      .withMessage(
        "Password must contain at least one letter and one digit or special character."
      ),
    body("phone").trim().custom(phoneNumberValidator),
  ],
  authController.signup
);

router.post("/login", authController.login);

router.post("/verifyToken", authController.verifyToken);

module.exports = router;
