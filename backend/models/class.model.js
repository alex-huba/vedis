const db = require("../util/db");

module.exports = class Class {
  static save(studentId, start, end) {
    return db.execute(
      "INSERT INTO classes (id, studentId, `start`, `end`) VALUES (UUID(),?,?,?)",
      [studentId, start, end]
    );
  }

  static getById(id) {
    return db.execute("SELECT * FROM classes WHERE id = ?", [id]);
  }

  static getAll() {
    return db.execute(`SELECT c.id,
        c.cancelled,
        c.start,
        c.end,
        c.studentId,
        u.name AS studentName
      FROM vedis.classes c
      INNER JOIN vedis.users u ON c.studentId = u.id;
    `);
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
    return db.execute("UPDATE classes SET cancelled = ? WHERE id = ?", [
      cancelled,
      id,
    ]);
  }

  static update(id, cancelled, studentId, start, end) {
    return db.execute(
      "UPDATE classes SET cancelled = ?, studentId = ?, start = ?, end = ? WHERE id = ?",
      [cancelled, studentId, start, end, id]
    );
  }
};
