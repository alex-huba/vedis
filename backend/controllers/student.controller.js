const { validationResult } = require("express-validator");

const User = require("../models/user.model");

exports.getAll = async (req, res, next) => {
  // Verify teacher role
  if (req.role != "teacher") return res.status(401).end();

  // Getting all students
  try {
    const [students] = await User.findAllStudents();
    res.status(200).json(students);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getStudentsUnfiltered = async (req, res, next) => {
  // Verify teacher role
  if (req.role != "teacher") return res.status(401).end();

  // Getting all students who are already approved or waiting for approval
  try {
    const [students] = await User.getStudentsUnfiltered();
    res.status(200).json(students);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getPendingStudents = async (req, res, next) => {
  // Verify teacher role
  if (req.role != "teacher") return res.status(401).end();

  // Getting all students who are waiting for approval
  try {
    const [students] = await User.getPendingStudents();
    res.status(200).json(students);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Verify teacher role
  if (req.role != "teacher") return res.status(401).end();

  // Deleting student by id
  try {
    await User.deleteById(req.body.id);
    res.status(204).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.changeRole = async (req, res, next) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Verify teacher role
  if (req.role != "teacher") return res.status(401).end();

  // Changing role of the particular student
  try {
    await User.changeRole(req.body.id, req.body.role);
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
