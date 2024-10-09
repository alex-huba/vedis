const express = require("express");
const { body } = require("express-validator");

const testController = require("../controllers/test.controller");

const router = express.Router();

router.post("/eng", [body("answers").notEmpty()], testController.eng);
router.post("/deu", [body("answers").notEmpty()], testController.deu);

module.exports = router;
