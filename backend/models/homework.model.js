const db = require("../util/db");

module.exports = class Homework {
  constructor(id, studentId, date, status, content) {
    this.id = id;
    this.studentId = studentId;
    this.date = date;
    this.status = status;
    this.content = content;
  }

  static save(studentId, date, status, content) {
    return db.execute(
      "INSERT INTO homework (id, studentId, date, status, content) VALUES (UUID(),?,?,?,?)",
      [studentId, date, status, content]
    );
  }

  static getById(studentId) {
    return db.execute("SELECT * FROM homework WHERE studentId = ?", [
      studentId,
    ]);
  }

  static getAll() {
    return db.execute("SELECT * FROM homework");
  }

  static deleteById(id) {
    return db.execute("DELETE FROM homework WHERE id = ?", [id]);
  }

  static updateStatus(id, status) {
    return db.execute("UPDATE homework SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
  }
};
