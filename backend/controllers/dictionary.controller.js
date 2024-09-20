const { validationResult } = require("express-validator");
const Dictionary = require("../models/dictionary.model");

exports.fetchByStudentId = async (req, res, next) => {
  // Check whether studentId is supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role == "teacher" || req.userId == req.params.studentId) {
    // Fetch whole dictionary for a specific student
    try {
      const [dictionary] = await Dictionary.getById(req.params.studentId);
      dictionary.sort((a, b) => new Date(b.date) - new Date(a.date));
      res.status(200).json(dictionary);
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

  try {
    const [dictionary] = await Dictionary.getAll();
    dictionary.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(dictionary);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.create = async (req, res, next) => {
  // Check whether all word details are supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Add a new word to the dictionary
  try {
    await Dictionary.save(
      req.body.studentId,
      new Date().toISOString().slice(0, 19),
      req.body.word,
      req.body.transcription,
      req.body.translation
    );
    res.status(201).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Deleting word by id
  try {
    await Dictionary.deleteById(req.body.id);
    res.status(204).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
