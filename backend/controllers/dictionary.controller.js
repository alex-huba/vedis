const { validationResult } = require("express-validator");
const Dictionary = require("../models/dictionary.model");

exports.fetchByStudentId = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role !== "teacher" && req.userId !== req.params.studentId)
    return res.status(401).end();

  try {
    const [dictionary] = await Dictionary.getById(req.params.studentId);
    res.status(200).json(dictionary);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.fetchAll = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role != "teacher") return res.status(401).end();

  try {
    let [dictionary] = await Dictionary.getAll();
    dictionary = dictionary.map((d) => {
      const parsedWords = JSON.parse(d.words);
      return {
        ...d,
        words: parsedWords,
      };
    });

    res.status(200).json(dictionary);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.fetchAmountByStudentId = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role !== "teacher" && req.userId !== req.params.studentId)
    return res.status(401).end();

  try {
    const [rows] = await Dictionary.getAmountById(req.params.studentId);
    res.status(200).json(rows[0].amount);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.create = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role != "teacher") return res.status(401).end();

  try {
    await Dictionary.save(
      req.body.studentId,
      req.body.dueDate,
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
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role != "teacher") return res.status(401).end();

  try {
    await Dictionary.deleteById(req.body.id);
    res.status(204).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
