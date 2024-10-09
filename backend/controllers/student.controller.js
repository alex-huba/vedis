const { validationResult } = require("express-validator");

const User = require("../models/user.model");

exports.getAll = async (req, res, next) => {
  if (req.role != "teacher") return res.status(401).end();

  try {
    const [students] = await User.findAllStudents();
    res.status(200).json(students);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getStudentsUnfiltered = async (req, res, next) => {
  if (req.role != "teacher") return res.status(401).end();

  try {
    const [students] = await User.getStudentsUnfiltered();
    res.status(200).json(students);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role != "teacher") return res.status(401).end();

  try {
    await User.deleteById(req.body.id);
    res.status(204).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.changeRole = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role != "teacher") return res.status(401).end();

  try {
    await User.changeRole(req.body.id, req.body.role);
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
