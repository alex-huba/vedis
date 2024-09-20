const { validationResult } = require("express-validator");
const Class = require("../models/class.model");

exports.create = async (req, res, next) => {
  // Check whether all tutorial details are supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Create a new class
  try {
    let classStart = req.body.start + ":00";
    let classEnd = req.body.end + ":00";

    await Class.save(req.body.studentId, classStart, classEnd);
    res.status(201).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.fetchAll = async (req, res, next) => {
  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Get all classes
  try {
    const [classes] = await Class.getAll();
    res.status(200).json(classes);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.fetchByStudentId = async (req, res, next) => {
  // Check whether studentId was supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role == "teacher" || req.userId == req.params.studentId) {
    // Get all tutorials for a particular student
    try {
      const [classes] = await Class.getByStudentId(req.params.studentId);
      res.status(200).json(classes);
    } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    }
  } else return res.status(401).end();
};

exports.delete = async (req, res, next) => {
  // Check whether class id was supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Delete class by id
  try {
    await Class.deleteById(req.body.id);
    res.status(204).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.changeStudent = async (req, res, next) => {
  // Check whether class id and student id were supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Change student of the particular class
  try {
    await Class.changeStudent(req.body.studentId, req.body.id);
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.changeTime = async (req, res, next) => {
  // Check whether class id and new timestamps were supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  req.body.start += ":00";
  req.body.end += ":00";

  // Make sure that there are more than 12 hours before the start of the class
  if (!cancellationPolicy(req.body.start))
    return res.status(400).json({
      msg: "Заняття можна створити не пізніше ніж за 12 годин до початку",
    });

  // Change time of the particular tutorial
  try {
    await Class.changeTime(req.body.start, req.body.end, req.body.id);
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.changeStatus = async (req, res, next) => {
  // Check whether class id and a new status were supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  let assignedStudentId = "";
  const retrievedClass = await Class.getById(req.body.id);
  const rows = retrievedClass[0];
  if (rows.length > 0) assignedStudentId = rows[0].studentId;
  if (req.role == "teacher" || req.userId == assignedStudentId) {
    // Make sure that there are more than 12 hours before the start of the class
    if (!cancellationPolicy(rows[0].start))
      return res.status(400).json({
        msg: "Заняття можна створити не пізніше ніж за 12 годин до початку",
      });

    // Changing status of the particular tutorial
    try {
      await Class.changeStatus(req.body.cancelled, req.body.id);
      res.status(200).end();
    } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    }
  } else return res.status(401).end();
};

exports.update = async (req, res, next) => {
  // Check whether all class details were supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Make sure that there are more than 12 hours before the start of the class
  if (!cancellationPolicy(req.body.start))
    return res.status(400).json({
      msg: "Заняття можна створити не пізніше ніж за 12 годин до початку",
    });

  // Updating all fields of tutorial
  try {
    await Class.update(
      req.params.id,
      req.body.cancelled,
      req.body.studentId,
      req.body.start,
      req.body.end
    );
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

cancellationPolicy = (startTime) => {
  const timestampDate = new Date(startTime);
  const currentDate = new Date();
  const timeDifference = timestampDate.getTime() - currentDate.getTime();

  // Check if the time difference is more than 12 hours (in milliseconds)
  return timeDifference > 12 * 60 * 60 * 1000;
};
