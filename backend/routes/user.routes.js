const express = require("express");
const { body, param } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const uploadAvatarMiddleware = require("../middleware/uploadAvatar.middleware");

const router = express.Router();

router.put(
  "/",
  [
    authMiddleware,
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Ім'я має бути мінімум 2 символи завдовжки")
      .matches(/.*(?:(?!\s|')[a-zA-Zа-яА-ЯїЇіІєЄґҐ']).*/)
      .withMessage("Ім'я містить недопустимі символи"),
    body("email").isEmail().withMessage("Некоректна електронна пошта"),
    body("phoneNumber")
      .trim()
      .matches(/^\+(?:[0-9] ?){6,14}[0-9]$/)
      .withMessage("Недопустимий номер телефону"),
    body("timezone").trim().notEmpty().withMessage("Некоректний часовий пояс"),
  ],
  userController.update
);

router.post(
  "/photo",
  [authMiddleware, uploadAvatarMiddleware.single("photo")],
  userController.uploadPhoto
);

router.get(
  "/photo/:userId",
  [authMiddleware, param("userId").trim().notEmpty()],
  userController.getPhoto
);

router.delete("/photo", authMiddleware, userController.deletePhoto);

module.exports = router;
