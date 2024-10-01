const db = require("../util/db");

module.exports = class Class {
  static save(studentId, start, end, price) {
    return db.execute(
      "INSERT INTO classes (id, studentId, `start`, `end`, price) VALUES (UUID(),?,?,?,?)",
      [studentId, start, end, price]
    );
  }

  static getById(id) {
    return db.execute("SELECT * FROM classes WHERE id = ?", [id]);
  }

  static getAll() {
    return db.execute(`SELECT c.id,
        c.isCancelled,
        c.start,
        c.end,
        c.studentId,
        u.name AS studentName,
        c.price,
        c.isPaid,
        u.timezone
      FROM vedis.classes c
      INNER JOIN vedis.users u ON c.studentId = u.id;
    `);
  }

  static getClassesForCurrentWeek() {
    return db.execute(
      `
        SELECT *
        FROM vedis.classes
        WHERE
          cancelled = false
          AND YEAR(STR_TO_DATE(start, '%Y-%m-%dT%H:%i:%s')) = YEAR(CURDATE())
          AND WEEK(STR_TO_DATE(start, '%Y-%m-%dT%H:%i:%s'), 1) = WEEK(CURDATE(), 1);
      `
    );
  }

  static countClassesForCurrentWeek() {
    return db.execute(
      `
        SELECT count(id) as amount
        FROM vedis.classes
        WHERE
          cancelled = false
          AND YEAR(STR_TO_DATE(start, '%Y-%m-%dT%H:%i:%s')) = YEAR(CURDATE())
          AND WEEK(STR_TO_DATE(start, '%Y-%m-%dT%H:%i:%s'), 1) = WEEK(CURDATE(), 1);
      `
    );
  }

  static getByStudentId(studentId) {
    return db.execute("SELECT * FROM classes WHERE studentId = ?", [studentId]);
  }

  static deleteById(id) {
    return db.execute("DELETE FROM classes WHERE id = ?", [id]);
  }

  static changeStudent(studentId, id) {
    return db.execute("UPDATE classes SET studentId = ? WHERE id = ?", [
      studentId,
      id,
    ]);
  }

  static changeTime(start, end, id) {
    return db.execute(
      "UPDATE classes SET `start` = ?, `end` = ? WHERE id = ?",
      [start, end, id]
    );
  }

  static changeStatus(cancelled, id) {
    return db.execute("UPDATE classes SET isCancelled = ? WHERE id = ?", [
      cancelled,
      id,
    ]);
  }

  static update(id, cancelled, studentId, start, end, price, isPaid) {
    return db.execute(
      "UPDATE classes SET cancelled = ?, studentId = ?, start = ?, end = ?, price = ?, isPaid = ? WHERE id = ?",
      [cancelled, studentId, start, end, price, isPaid, id]
    );
  }

  static updatePaymentStatus(id, isPaid) {
    return db.execute("UPDATE classes SET isPaid = ? WHERE id = ?", [
      isPaid,
      id,
    ]);
  }
};
