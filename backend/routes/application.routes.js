const express = require("express");
const { body, param } = require("express-validator");
const User = require("../models/user.model");
const applicationController = require("../controllers/application.controller");
const authMiddleware = require("../middleware/auth.middleware");

const emailValidator = async (email) => {
  const user = await User.findByEmail(email);
  if (user[0].length > 0) {
    return Promise.reject("На цю адресу вже зареєстровано профіль");
  }
};

const router = express.Router();

router.get("/", authMiddleware, applicationController.fetchAll);

router.get(
  "/unprocessed",
  authMiddleware,
  applicationController.fetchUnprocessed
);

router.post(
  "/",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .matches(/.*(?:(?!\s|')[a-zA-Zа-яА-ЯїЇіІєЄґҐ']).*/)
      .withMessage("Ім'я містить недопустимі символи або занадто коротке"),
    body("email").trim().isEmail().custom(emailValidator),
    body("course").trim().not().isEmpty(),
    body("phoneNumber").trim().not().isEmpty(),
    body("howToConnect").trim().not().isEmpty(),
  ],
  applicationController.create
);

router.put(
  "/:id",
  [
    authMiddleware,
    param("id").trim().not().isEmpty(),
    body("processed").isBoolean().toBoolean(),
  ],
  applicationController.update
);

module.exports = router;
