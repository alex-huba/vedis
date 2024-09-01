const express = require("express");
const { body } = require("express-validator");

const testController = require("../controllers/test.controller");

const router = express.Router();

router.post("/eng", [body("answers").not().isEmpty()], testController.eng);
router.post("/deu", [body("answers").not().isEmpty()], testController.deu);

module.exports = router;
