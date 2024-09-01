const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const Tutorial = require("../models/tutorial.model");
const User = require("../models/user.model");

// Check whether user has sufficient rights (i.e. "teacher" role) to create a new tutorial
function verifyTeacherRole(req) {
  const authHeader = req.get("Authorization");
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  if (decodedToken.role !== "teacher") {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
}

exports.createTutorial = async (req, res, next) => {
  // Check whether all tutorial details are supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }

  try {
    verifyTeacherRole(req);
  } catch (err) {
    return res.status(401).end();
  }

  // Creating a new tutorial
  try {
    let classStart = req.body.start;
    let classEnd = req.body.end;
    classStart = classStart + ":00";
    classEnd = classEnd + ":00";

    const tutorial = await Tutorial.save(
      "OK",
      req.body.studentId,
      req.body.studentName,
      classStart,
      classEnd
    );
    res.status(201).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.fetchAll = async (req, res, next) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }

  try {
    verifyTeacherRole(req);
  } catch (err) {
    return res.status(401).end();
  }

  // Getting all tutorials
  try {
    const [tutorials] = await Tutorial.getAll();
    res.status(200).json(tutorials);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.fetchByStudentId = async (req, res, next) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }
  if (!req.params.studentId) {
    return res.status(400).end();
  }

  // Getting tutorials for a particular student
  try {
    const [tutorials] = await Tutorial.getByStudentId(req.params.studentId);
    res.status(200).json(tutorials);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteTutorial = async (req, res, next) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }

  try {
    verifyTeacherRole(req);
  } catch (err) {
    return res.status(401).end();
  }

  // Deleting tutorial by id
  try {
    const result = await Tutorial.deleteById(req.body.id);
    res.status(204).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.changeStudent = async (req, res, next) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }

  try {
    verifyTeacherRole(req);
  } catch (err) {
    return res.status(401).end();
  }

  // Changing studentId of the particular tutorial
  try {
    const result = await Tutorial.changeStudent(
      req.body.studentId,
      req.body.id
    );
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.changeTime = async (req, res, next) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }

  try {
    verifyTeacherRole(req);
  } catch (err) {
    return res.status(401).end();
  }

  // Changing time of the particular tutorial
  try {
    const result = await Tutorial.changeTime(req.body.time, req.body.id);
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.changeStatus = async (req, res, next) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }

  // Changing status of the particular tutorial
  try {
    const result = await Tutorial.changeStatus(req.body.status, req.body.id);
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateTutorial = async (req, res, next) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }

  // Updating all fields of tutorial
  try {
    const id = req.body.id;
    const status = req.body.status;
    const studentId = req.body.studentId;
    const start = req.body.start;
    const end = req.body.end;

    const title = await User.getTitleById(studentId);

    const result = await Tutorial.updateTutorial(
      id,
      status,
      studentId,
      title[0][0].name,
      start,
      end
    );
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
