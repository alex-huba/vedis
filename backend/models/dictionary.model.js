const db = require("../util/db");

module.exports = class Dictionary {
  static save(studentId, createdAt, word, transcription, translation) {
    return db.execute(
      "INSERT INTO dictionary (id, studentId, createdAt, word, transcription, translation) VALUES (UUID(), ?,?,?,?,?)",
      [studentId, createdAt, word, transcription, translation]
    );
  }

  static getById(studentId) {
    return db.execute("SELECT * FROM dictionary WHERE studentId = ?", [
      studentId,
    ]);
  }

  static getAll() {
    return db.execute("SELECT * FROM dictionary");
  }

  
  static deleteById(id) {
    return db.execute("DELETE FROM dictionary WHERE id = ?", [id]);
  }
};
