const { validationResult } = require("express-validator");

const Homework = require("../models/homework.model");
const User = require("../models/user.model");
const AuthController = require("./auth.controller");

exports.createHomework = async (req, res, next) => {
  // Check whether all homework details are supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }

  // Check user role
  try {
    await AuthController.verifyTeacherRole(req);
  } catch (err) {
    return res.status(401).end();
  }

  // Creating a new homework
  try {
    await Homework.save(
      req.body.studentId,
      req.body.date,
      req.body.status,
      req.body.content
    );
    res.status(201).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getHomeworkById = async (req, res, next) => {
  // Check whether studentId is supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }
  if (!req.params.studentId) {
    return res.status(400).end();
  }

  // Fetching all homework for a specific student
  try {
    const [homework] = await Homework.getById(req.params.studentId);
    res.status(200).json(homework);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllHomework = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }

  try {
    await AuthController.verifyTeacherRole(req);
  } catch (err) {
    return res.status(401).end();
  }

  // Fetching all homework
  try {
    const [homework] = await Homework.getAll();
    const [students] = await User.findAllStudents();

    const result = students.map((student) => ({
      ...student,
      homework: homework.filter((hw) => hw.studentId === student.id),
    }));

    res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteHomework = async (req, res, next) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }

  try {
    await AuthController.verifyTeacherRole(req);
  } catch (err) {
    return res.status(401).end();
  }

  // Deleting tutorial by id
  try {
    await Homework.deleteById(req.body.id);
    res.status(204).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateHomeworkStatus = async (req, res, next) => {
  // Check whether homework is supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }
  if (!req.params.id) {
    return res.status(400).end();
  }

  // Updating status of a specific homework
  try {
    await Homework.updateStatus(req.params.id, req.body.status);
    res.status(204).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
