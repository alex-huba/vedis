const express = require("express");
const { body, param } = require("express-validator");

const classController = require("../controllers/class.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// used
router.post(
  "/",
  [
    authMiddleware,
    body("studentId").trim().not().isEmpty(),
    body("start").trim().not().isEmpty(),
    body("end").trim().not().isEmpty(),
    body("price").isInt(),
  ],
  classController.create
);

// used
router.get("/", authMiddleware, classController.fetchAll);

router.get(
  "/current-week/amount",
  authMiddleware,
  classController.countForCurrentWeek
);

router.get(
  "/current-week",
  authMiddleware,
  classController.fetchForCurrentWeek
);

// used
router.get(
  "/:studentId",
  authMiddleware,
  param("studentId").trim().not().isEmpty(),
  classController.fetchByStudentId
);

// used
router.delete(
  "/",
  [authMiddleware, body("id").trim().not().isEmpty()],
  classController.delete
);

// used
router.put(
  "/:id/cancellation",
  [
    authMiddleware,
    param("id").trim().not().isEmpty(),
    body("isCancelled").isBoolean().toBoolean(),
  ],
  classController.changeStatus
);

// used
router.put(
  "/:id/payment",
  [
    authMiddleware,
    param("id").trim().not().isEmpty(),
    body("isPaid").isBoolean().toBoolean(),
  ],
  classController.changePaymentStatus
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
  "/:id",
  [
    authMiddleware,
    param("id").trim().not().isEmpty(),
    body("cancelled").isBoolean().toBoolean(),
    body("studentId").trim().not().isEmpty(),
    body("start").trim().not().isEmpty(),
    body("end").trim().not().isEmpty(),
    body("price").isInt(),
    body("isPaid").isBoolean().toBoolean(),
  ],
  classController.update
);

module.exports = router;
