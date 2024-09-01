const express = require("express");
const { body } = require("express-validator");

const tutorialController = require("../controllers/tutorial.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  [
    authMiddleware,
    body("studentId").trim().not().isEmpty(),
    body("studentName").trim().not().isEmpty(),
    body("start").trim().not().isEmpty(),
    body("end").trim().not().isEmpty(),
  ],
  tutorialController.createTutorial
);

router.get("/", authMiddleware, tutorialController.fetchAll);

router.get("/:studentId", authMiddleware, tutorialController.fetchByStudentId);

router.delete(
  "/",
  [authMiddleware, body("id").trim().not().isEmpty()],
  tutorialController.deleteTutorial
);

router.put(
  "/change-student",
  [
    authMiddleware,
    body("studentId").trim().not().isEmpty(),
    body("id").trim().not().isEmpty(),
  ],
  tutorialController.changeStudent
);

router.put(
  "/change-time",
  [
    authMiddleware,
    body("time").trim().not().isEmpty(),
    body("id").trim().not().isEmpty(),
  ],
  tutorialController.changeTime
);

router.put(
  "/change-status",
  [
    authMiddleware,
    body("status").trim().not().isEmpty(),
    body("id").trim().not().isEmpty(),
  ],
  tutorialController.changeStatus
);

router.put(
  "/update",
  [
    authMiddleware,
    body("id").trim().not().isEmpty(),
    body("status").trim().not().isEmpty(),
    body("studentId").trim().not().isEmpty(),
    body("start").trim().not().isEmpty(),
    body("end").trim().not().isEmpty(),
  ],
  tutorialController.updateTutorial
);

module.exports = router;
