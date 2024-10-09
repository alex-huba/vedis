const express = require("express");
const { body } = require("express-validator");

const studentController = require("../controllers/student.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, studentController.getAll);

router.get(
  "/unfiltered",
  authMiddleware,
  studentController.getStudentsUnfiltered
);

router.delete(
  "/",
  [authMiddleware, body("id").trim().notEmpty()],
  studentController.deleteStudent
);

router.put(
  "/",
  [
    authMiddleware,
    body("id").trim().notEmpty(),
    body("role").trim().notEmpty(),
  ],
  studentController.changeRole
);

module.exports = router;
