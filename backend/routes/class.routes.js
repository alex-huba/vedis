const express = require("express");
const { body, param } = require("express-validator");

const classController = require("../controllers/class.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  [
    authMiddleware,
    body("studentId").trim().not().isEmpty(),
    body("start").trim().not().isEmpty(),
    body("end").trim().not().isEmpty(),
  ],
  classController.create
);

router.get("/", authMiddleware, classController.fetchAll);

router.get(
  "/:studentId",
  authMiddleware,
  param("studentId").trim().not().isEmpty(),
  classController.fetchByStudentId
);

router.delete(
  "/",
  [authMiddleware, body("id").trim().not().isEmpty()],
  classController.delete
);

router.put(
  "/change-student",
  [
    authMiddleware,
    body("studentId").trim().not().isEmpty(),
    body("id").trim().not().isEmpty(),
  ],
  classController.changeStudent
);

router.put(
  "/change-time",
  [
    authMiddleware,
    body("start").trim().not().isEmpty(),
    body("end").trim().not().isEmpty(),
    body("id").trim().not().isEmpty(),
  ],
  classController.changeTime
);

router.put(
  "/change-status",
  [
    authMiddleware,
    body("cancelled").isBoolean().toBoolean(),
    body("id").trim().not().isEmpty(),
  ],
  classController.changeStatus
);

router.put(
  "/:id",
  [
    authMiddleware,
    param("id").trim().not().isEmpty(),
    body("cancelled").isBoolean().toBoolean(),
    body("studentId").trim().not().isEmpty(),
    body("start").trim().not().isEmpty(),
    body("end").trim().not().isEmpty(),
  ],
  classController.update
);

module.exports = router;
