const { validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const Class = require("../models/class.model");

exports.create = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role != "teacher") return res.status(401).end();

  try {
    await Class.save(
      req.body.studentId,
      req.body.start,
      req.body.end,
      req.body.price
    );
    res.status(201).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

/**
 * @returns array of all classes
 * - id
 * - isCancelled
 * - start (converted to student's timezone) looks like "2024-10-10T11:00"
 * - end (converted to student's timezone) looks like "2024-10-10T11:00"
 * - studentId
 * - studentName
 * - price
 * - isPaid
 * - timezone (of student)
 */
exports.fetchAll = async (req, res, next) => {
  if (req.role != "teacher") return res.status(401).end();

  try {
    const [classes] = await Class.getAll();
    const parsedClasses = classes
      .map((c) => {
        return {
          ...c,
          isCancelled: !!c.isCancelled,
          isPaid: !!c.isPaid,
          // 2024-10-10T10:00
          start: DateTime.fromJSDate(new Date(c.start)).toFormat(
            "yyyy-MM-dd'T'HH:mm"
          ),
          end: DateTime.fromJSDate(new Date(c.end)).toFormat(
            "yyyy-MM-dd'T'HH:mm"
          ),
        };
      })
      .sort((a, b) => new Date(b.start) - new Date(a.start));
    res.status(200).json(parsedClasses);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

/**
 * @returns array of all recent classes (not earlier than 1 month)
 * - id
 * - isCancelled
 * - start (converted to student's timezone) looks like "2024-10-10T11:00"
 * - end (converted to student's timezone) looks like "2024-10-10T11:00"
 * - studentId
 * - studentName
 * - price
 * - isPaid
 * - timezone (of student)
 */
exports.fetchAllRecent = async (req, res, next) => {
  if (req.role != "teacher") return res.status(401).end();

  try {
    const [classes] = await Class.getAllRecent();
    const parsedClasses = classes
      .map((c) => {
        return {
          ...c,
          isCancelled: !!c.isCancelled,
          isPaid: !!c.isPaid,
          // 2024-10-10T10:00
          start: DateTime.fromJSDate(new Date(c.start)).toFormat(
            "yyyy-MM-dd'T'HH:mm"
          ),
          end: DateTime.fromJSDate(new Date(c.end)).toFormat(
            "yyyy-MM-dd'T'HH:mm"
          ),
        };
      })
      .sort((a, b) => new Date(b.start) - new Date(a.start));
    res.status(200).json(parsedClasses);
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
    const [classes] = await Class.getByStudentId(req.params.studentId);
    const parsedClasses = classes.map((c) => ({
      ...c,
      cancelled: !!c.cancelled,
      isPaid: !!c.isPaid,
    }));
    res.status(200).json(parsedClasses);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.countForCurrentWeek = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role !== "teacher" && req.userId !== req.params.userId)
    return res.status(401).end();

  try {
    const [row] = await Class.countClassesForCurrentWeek(req.role, req.userId);
    res.status(200).json(row[0].amount);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.countForCurrentWeekStudent = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role !== "teacher" && req.userId !== req.params.studentId)
    return res.status(401).end();
};

exports.fetchAllForToday = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role != "teacher" && req.userId !== req.params.userId)
    return res.status(401).end();

  try {
    const [classes] = await Class.getAllForToday(req.role, req.userId);
    const parsedClasses = classes.map((c) => ({
      ...c,
      isCancelled: !!c.isCancelled,
      isPaid: !!c.isPaid,
    }));
    res.status(200).json(parsedClasses);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role != "teacher") return res.status(401).end();

  try {
    await Class.deleteById(req.body.id);
    res.status(204).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.changeStatus = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  let assignedStudentId = "";
  const retrievedClass = await Class.getById(req.params.id);
  const rows = retrievedClass[0];
  if (rows.length > 0) assignedStudentId = rows[0].studentId;

  if (req.role !== "teacher" && req.userId !== assignedStudentId)
    return res.status(401).end();

  // Make sure that there are more than 12 hours before the start of the class
  if (!cancellationPolicy(rows[0].start, req.role)) {
    return res.status(400).json({
      msg: "Заняття можна скасувати не пізніше ніж за 12 годин до початку",
    });
  }

  // Changing status of the particular tutorial
  try {
    await Class.changeStatus(req.body.isCancelled, req.params.id);
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.changePaymentStatus = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  if (req.role != "teacher") return res.status(401).end();

  try {
    await Class.updatePaymentStatus(req.params.id, req.body.isPaid);
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

cancellationPolicy = (startTime, userRole) => {
  if (userRole === "teacher") return true;

  const timestampDate = new Date(startTime);
  const currentDate = new Date();
  const timeDifference = timestampDate.getTime() - currentDate.getTime();

  // Check if the time difference is more than 12 hours (in milliseconds)
  return timeDifference > 12 * 60 * 60 * 1000;
};
