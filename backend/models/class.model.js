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

  static getAllRecent() {
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
      INNER JOIN vedis.users u ON c.studentId = u.id
      WHERE c.start >= NOW() - INTERVAL 1 MONTH;
    `);
  }

  static getAllForToday(role, userId) {
    if (role === "teacher") {
      return db.execute(
        `
        SELECT 
        c.id,
        c.isCancelled,
        c.start,
        c.end,
        c.studentId,
        u.name AS studentName,
        c.price,
        c.isPaid,
        u.timezone
        FROM 
          vedis.classes c
        INNER JOIN 
          vedis.users u ON c.studentId = u.id
        WHERE 
          DATE(c.start) = CURDATE(); 
        `
      );
    } else {
      return db.execute(
        `
        SELECT 
        c.id,
        c.isCancelled,
        c.start,
        c.end,
        c.studentId,
        u.name AS studentName,
        c.price,
        c.isPaid,
        u.timezone
        FROM 
          vedis.classes c
        INNER JOIN 
          vedis.users u ON c.studentId = u.id
        WHERE 
          DATE(c.start) = CURDATE()
          AND c.studentId = ?; 
        `,
        [userId]
      );
    }
  }

  static countClassesForCurrentWeek(role, userId) {
    if (role === "teacher") {
      return db.execute(
        `
          SELECT COUNT(id) AS amount
          FROM vedis.classes
          WHERE
            isCancelled = false
            AND YEAR(start) = YEAR(CURDATE())
            AND WEEK(start, 1) = WEEK(CURDATE(), 1);
        `
      );
    } else {
      return db.execute(
        `
          SELECT COUNT(id) AS amount
          FROM vedis.classes
          WHERE
            studentId = ?
            AND isCancelled = false
            AND YEAR(start) = YEAR(CURDATE())
            AND WEEK(start, 1) = WEEK(CURDATE(), 1);
        `,
        [userId]
      );
    }
  }

  static getByStudentId(studentId) {
    return db.execute("SELECT * FROM classes WHERE studentId = ?", [studentId]);
  }

  static deleteById(id) {
    return db.execute("DELETE FROM classes WHERE id = ?", [id]);
  }

  static changeStatus(cancelled, id) {
    return db.execute("UPDATE classes SET isCancelled = ? WHERE id = ?", [
      cancelled,
      id,
    ]);
  }

  static updatePaymentStatus(id, isPaid) {
    return db.execute("UPDATE classes SET isPaid = ? WHERE id = ?", [
      isPaid,
      id,
    ]);
  }
};
