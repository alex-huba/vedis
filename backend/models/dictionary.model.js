const db = require("../util/db");

module.exports = class Dictionary {
  constructor(id, studentId, date, word, transcription, translation) {
    this.id = id;
    this.studentId = studentId;
    this.date = date;
    this.word = word;
    this.transcription = transcription;
    this.translation = translation;
  }

  static save(studentId, date, word, transcription, translation) {
    return db.execute(
      "INSERT INTO dictionary (id, studentId, date, word, transcription, translation) VALUES (UUID(), ?,?,?,?,?)",
      [studentId, date, word, transcription, translation]
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
