const express = require("express");

const analyticsController = require("../controllers/analytics.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, analyticsController.monthlyRevenueReport);

module.exports = router;
