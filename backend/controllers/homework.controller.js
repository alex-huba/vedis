const { validationResult } = require("express-validator");
const Homework = require("../models/homework.model");

exports.create = async (req, res, next) => {
  // Check whether all homework details are supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Create a new homework
  try {
    await Homework.save(
      req.body.studentId,
      new Date().toISOString().slice(0, 19),
      req.body.dueDate,
      req.body.content
    );
    res.status(201).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.fetchByStudentId = async (req, res, next) => {
  // Check whether studentId is supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role == "teacher" || req.userId == req.params.studentId) {
    // Fetch all homework for a specific student
    try {
      const [homework] = await Homework.getByStudentId(req.params.studentId);
      res.status(200).json(homework);
    } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    }
  } else return res.status(401).end();
};

exports.fetchAll = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Fetch all homework
  try {
    const [homework] = await Homework.getAll();

    res.status(200).json(homework);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.fetchUnfinished = async (req, res, next) => {
  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  try {
    const [homework] = await Homework.getUnfinished();
    res.status(200).json(homework);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.countUnfinished = async (req, res, next) => {
    // Check whether user has sufficient rights
    if (req.role != "teacher") return res.status(401).end();

    // Get total amount of unfinished homework
    try {
      const [row] = await Homework.countUnfinished();
      res.status(200).json(row[0].amount);
    } catch (err) {
      if(!err.statusCode) err.statusCode = 500;
      next(err);
    }
}

exports.delete = async (req, res, next) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Delete homework by id
  try {
    await Homework.deleteById(req.body.id);
    res.status(204).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  // Check whether homework is supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role == "teacher" || req.userId == req.params.studentId) {
    // Update status of a specific homework
    try {
      await Homework.updateStatus(req.params.id, req.body.done);
      res.status(204).end();
    } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    }
  } else return res.status(401).end();
};
