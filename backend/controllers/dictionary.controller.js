const { validationResult } = require("express-validator");

const Dictionary = require("../models/dictionary.model");
const User = require("../models/user.model");
const AuthController = require("./auth.controller");

exports.getDictionaryById = async (req, res, next) => {
  // Check whether studentId is supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }
  if (!req.params.studentId) {
    return res.status(400).end();
  }

  // Fetching whole dictionary for a specific student
  try {
    const [dictionary] = await Dictionary.getById(req.params.studentId);
    dictionary.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.status(200).json(dictionary);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getWholeDictionary = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }

  try {
    await AuthController.verifyTeacherRole(req);
  } catch (err) {
    return res.status(401).end();
  }

  try {
    const [dictionary] = await Dictionary.getAll();
    dictionary.sort((a, b) => new Date(b.date) - new Date(a.date));
    const [students] = await User.findAllStudents();

    const result = students.map((student) => ({
      ...student,
      dictionary: dictionary.filter((dict) => dict.studentId === student.id),
    }));

    res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addNewWord = async (req, res, next) => {
  // Check whether all word details are supplied
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

  // Add a new word to the dictionary
  try {
    await Dictionary.save(
      req.body.studentId,
      req.body.date,
      req.body.word,
      req.body.transcription,
      req.body.translation
    );
    res.status(201).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteWord = async (req, res, next) => {
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

  // Deleting word by id
  try {
    await Dictionary.deleteById(req.body.id);
    res.status(204).end();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
