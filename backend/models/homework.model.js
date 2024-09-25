const db = require("../util/db");

module.exports = class Homework {
  static save(studentId, createdAt, dueDate, content) {
    return db.execute(
      "INSERT INTO homework (id, studentId, createdAt, dueDate, content) VALUES (UUID(),?,?,?,?)",
      [studentId, createdAt, dueDate, content]
    );
  }

  static getByStudentId(studentId) {
    return db.execute("SELECT * FROM homework WHERE studentId = ?", [
      studentId,
    ]);
  }

  static getAll() {
    return db.execute("SELECT * FROM homework");
  }

  static getUnfinished() {
    return db.execute("SELECT * FROM homework WHERE done = false");
  }

  static countUnfinished() {
    return db.execute("select count(id) as amount from homework where done = false");
  }

  static deleteById(id) {
    return db.execute("DELETE FROM homework WHERE id = ?", [id]);
  }

  static updateStatus(id, done) {
    return db.execute("UPDATE homework SET done = ? WHERE id = ?", [done, id]);
  }
};
