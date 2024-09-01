const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

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

exports.getAll = async (req, res, next) => {
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

  // Getting all students
  try {
    const [students] = await User.findAllStudents();
    res.status(200).json(students);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getStudentsUnfiltered = async (req, res, next) => {
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

  // Getting all students which are already approved or wait for approval
  try {
    const [students] = await User.getStudentsUnfiltered();
    res.status(200).json(students);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
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

  // Deleting student by id
  try {
    const result = await User.deleteById(req.body.id);
    res.status(204).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.changeRole = async (req, res, next) => {
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

  // Changing role of the particular student
  try {
    const result = await User.changeRole(
      req.body.id,
      req.body.role
    );
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};