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

  static getById(id) {
    return db.execute("SELECT * from homework WHERE id = ?", [id]);
  }

  static getAll() {
    return db.execute(
      `
      SELECT 
      u.name,
      u.email,
      CONCAT('[', 
          GROUP_CONCAT(
              CONCAT(
                  '{"createdAt": "', h.createdAt, '",',
                  '"dueDate": "', h.dueDate, '",',
                  '"id": "', h.id, '",',
                  '"done": ', h.done, ',',
                  '"content": "', h.content, '"}'
              )
              ORDER BY STR_TO_DATE(h.dueDate, '%Y-%m-%dT%H:%i') ASC
          ),
      ']') AS homework
      FROM vedis.users u
      JOIN vedis.homework h ON u.id = h.studentId
      where u.role = "student"
      GROUP BY u.id;
      `
    );
  }

  static getUnfinished() {
    return db.execute("SELECT * FROM homework WHERE done = false");
  }

  static countUnfinished(role, userId) {
    if (role === "teacher") {
      return db.execute(
        "select count(id) as amount from homework where done = false"
      );
    } else {
      return db.execute(
        "select count(id) as amount from homework where done = false and studentId = ?",
        [userId]
      );
    }
  }

  static deleteById(id) {
    return db.execute("DELETE FROM homework WHERE id = ?", [id]);
  }

  static updateStatus(id, done) {
    return db.execute("UPDATE homework SET done = ? WHERE id = ?", [done, id]);
  }
};
