const db = require("../util/db");

module.exports = class Dictionary {
  static save(studentId, dueDate, word, transcription, translation) {
    return db.execute(
      "INSERT INTO dictionary (id, studentId, dueDate, word, transcription, translation) VALUES (UUID(), ?,?,?,?,?)",
      [studentId, dueDate, word, transcription, translation]
    );
  }

  static getById(studentId) {
    return db.execute(
      "SELECT * FROM dictionary WHERE studentId = ? ORDER BY dueDate DESC",
      [studentId]
    );
  }

  static getAmountById(studentId) {
    return db.execute("SELECT COUNT(id) AS amount FROM dictionary WHERE studentId = ?", [
      studentId,
    ]);
  }

  static getAll() {
    return db.execute(`
      SELECT
        u.id AS studentId,
        u.name,
        u.email,
        CONCAT('[', GROUP_CONCAT(
          CONCAT(
              '{"id":"', d.id,
              '", "dueDate":"', d.dueDate,
              '", "word":"', d.word,
              '", "transcription":"', d.transcription,
              '", "translation":"', d.translation, '"}'
          )
          ORDER BY d.dueDate DESC
        ), ']') AS words
      FROM
        vedis.users u
      JOIN
        vedis.dictionary d ON u.id = d.studentId
      GROUP BY
        u.id, u.name;  
    `);
  }

  static deleteById(id) {
    return db.execute("DELETE FROM dictionary WHERE id = ?", [id]);
  }
};
