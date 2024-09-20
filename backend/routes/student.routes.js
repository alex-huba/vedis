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

router.get("/pending", authMiddleware, studentController.getPendingStudents);

router.delete(
  "/",
  [authMiddleware, body("id").trim().not().isEmpty()],
  studentController.deleteStudent
);

router.put(
  "/",
  [
    authMiddleware,
    body("id").trim().not().isEmpty(),
    body("role").trim().not().isEmpty(),
  ],
  studentController.changeRole
);

module.exports = router;
