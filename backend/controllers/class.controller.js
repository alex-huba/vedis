const { validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const Class = require("../models/class.model");

exports.create = async (req, res, next) => {
  // Check whether all tutorial details are supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Create a new class
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
  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Get all classes
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

exports.fetchByStudentId = async (req, res, next) => {
  // Check whether studentId was supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role == "teacher" || req.userId == req.params.studentId) {
    // Get all tutorials for a particular student
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
  } else return res.status(401).end();
};

exports.countForCurrentWeek = async (req, res, next) => {
  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Get total amount of classes planned for the current week
  try {
    const [row] = await Class.countClassesForCurrentWeek();
    res.status(200).json(row[0].amount);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.fetchForCurrentWeek = async (req, res, next) => {
  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Get all classes planned for the current week
  try {
    const [classes] = await Class.getClassesForCurrentWeek();
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
  const retrievedClass = await Class.getById(req.params.id);
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
      await Class.changeStatus(req.body.isCancelled, req.params.id);
      res.status(200).end();
    } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    }
  } else return res.status(401).end();
};

exports.changePaymentStatus = async (req, res, next) => {
  // Check whether isPaid and id were supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  try {
    await Class.updatePaymentStatus(req.params.id, req.body.isPaid);
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.update = async (req, res, next) => {
  // Check whether all class details were supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Updating all fields of tutorial
  try {
    await Class.update(
      req.params.id,
      req.body.cancelled,
      req.body.studentId,
      req.body.start,
      req.body.end,
      req.body.price,
      req.body.isPaid
    );
    res.status(200).end();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
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

// Function to handle time conversion for teacher's timezone
// convertToStudentTime = (timestamp) => {
//   // Parse the student's timestamp using their timezone
//   const studentTime = DateTime.fromISO(studentTimestamp, {
//     zone: this.timezone.student,
//   });

//   // Convert the student's time to the teacher's timezone
//   const teacherTime = studentTime.setZone(this.timezone.teacher);

//   // Return the teacher's time in a readable format
//   return teacherTime.toFormat("HH:mm");
// };
