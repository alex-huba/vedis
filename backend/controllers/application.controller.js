const { validationResult } = require("express-validator");
const Application = require("../models/application.model");

exports.fetchAll = async (req, res, next) => {
  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Get all applications
  try {
    const [applications] = await Application.getAll();
    return res.status(200).json(applications);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.create = async (req, res, next) => {
  // Check whether all application details are supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Create a new application
  try {
    await Application.save(
      req.body.name,
      req.body.email,
      req.body.course,
      req.body.phoneNumber,
      req.body.howToConnect,
      new Date().toISOString().slice(0, 19)
    );
    res.status(201).end();
  } catch (err) {
    if (err.code == "ER_DUP_ENTRY") {
      err.statusCode = 400;
      err.message = "Ми вже отримали заявку з такими контактними даними";
    }
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.fetchNumberOfApplications = async (req, res, next) => {
  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Get total amount of applications
  try {
    const [row] = await Application.countAll();
    return res.status(200).json(row[0].amount);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteByEmail = async (req, res, next) => {
  // Check whether all application details are supplied
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ message: "Неправильний формат електронної пошти" });

  // Delete application by email
  try {
    await Application.deleteByEmail(req.body.email);
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
