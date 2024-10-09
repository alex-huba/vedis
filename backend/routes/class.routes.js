const express = require("express");
const { body, param } = require("express-validator");

const classController = require("../controllers/class.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  [
    authMiddleware,
    body("studentId").trim().notEmpty(),
    body("start").trim().notEmpty(),
    body("end").trim().notEmpty(),
    body("price").isInt(),
  ],
  classController.create
);

router.get("/", authMiddleware, classController.fetchAll);

router.get("/recent", authMiddleware, classController.fetchAllRecent);

router.get(
  "/current/week/amount/:userId",
  [authMiddleware, param("userId").trim().notEmpty()],
  classController.countForCurrentWeek
);

router.get(
  "/today/:userId",
  [authMiddleware, param("userId").trim().notEmpty()],
  classController.fetchAllForToday
);

router.get(
  "/:studentId",
  [authMiddleware, param("studentId").trim().notEmpty()],
  classController.fetchByStudentId
);

router.delete(
  "/",
  [authMiddleware, body("id").trim().notEmpty()],
  classController.delete
);

router.put(
  "/:id/cancellation",
  [
    authMiddleware,
    param("id").trim().notEmpty(),
    body("isCancelled").isBoolean().toBoolean(),
  ],
  classController.changeStatus
);

router.put(
  "/:id/payment",
  [
    authMiddleware,
    param("id").trim().notEmpty(),
    body("isPaid").isBoolean().toBoolean(),
  ],
  classController.changePaymentStatus
);

module.exports = router;
