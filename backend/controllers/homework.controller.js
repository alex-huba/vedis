const { validationResult } = require("express-validator");
const Homework = require("../models/homework.model");

exports.create = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role != "teacher") return res.status(401).end();

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
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role !== "teacher" && req.userId !== req.params.studentId)
    return res.status(401).end();

  try {
    const [homework] = await Homework.getByStudentId(req.params.studentId);
    res.status(200).json(homework);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.fetchAll = async (req, res, next) => {
  if (req.role != "teacher") return res.status(401).end();

  try {
    let [homework] = await Homework.getAll();
    homework = homework.map((elem) => {
      elem.homework = JSON.parse(elem.homework);
      elem.homework = elem.homework
        .map((hw) => {
          hw.done = !!hw.done;
          return hw;
        })
        .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

      return elem;
    });

    res.status(200).json(homework);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.fetchUnfinished = async (req, res, next) => {
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
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role != "teacher" && req.userId !== req.params.userId)
    return res.status(401).end();

  try {
    const [row] = await Homework.countUnfinished(req.role, req.userId);
    res.status(200).json(row[0].amount);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role != "teacher") return res.status(401).end();

  try {
    await Homework.deleteById(req.body.id);
    res.status(204).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  const [homeworkToChange] = await Homework.getById(req.params.id);

  if (req.role !== "teacher" && req.userId !== homeworkToChange[0].studentId)
    return res.status(401).end();

  try {
    await Homework.updateStatus(req.params.id, req.body.done);
    res.status(204).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
