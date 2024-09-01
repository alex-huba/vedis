const db = require("../util/db");

module.exports = class Tutorial {
  constructor(id, status, studentId, time) {
    this.id = id;
    this.status = status;
    this.studentId = studentId;
    this.time = time;
  }

  static save(status, studentId, studentName, start, end) {
    return db.execute(
      "INSERT INTO classes (id, status, studentId, title, start, end) VALUES (UUID(),?,?,?,?,?)",
      [status, studentId, studentName, start, end]
    );
  }

  static getAll() {
    return db.execute("SELECT * FROM classes");
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

  static changeTime(time, id) {
    return db.execute("UPDATE classes SET time = ? WHERE id = ?", [time, id]);
  }

  static changeStatus(status, id) {
    return db.execute("UPDATE classes SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
  }

  static updateTutorial(id, status, studentId, title, start, end) {
    let color = "#006400";
    if (status !== "OK") {
      color = "red";
    }
    return db.execute(
      "UPDATE classes SET status = ?, studentId = ?, title = ?, start = ?, end = ?, color = ? WHERE id = ?",
      [status, studentId, title, start, end, color, id]
    );
  }
};
