const db = require("../util/db");

module.exports = class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static findByEmail(email) {
    return db.execute("SELECT * FROM users WHERE email = ?", [email]);
  }

  static findById(id) {
    return db.execute("SELECT * FROM users WHERE id = ?", [id]);
  }

  static findAllStudents() {
    return db.execute("SELECT * FROM users WHERE role = 'student'");
  }

  static getStudentsUnfiltered() {
    return db.execute(
      "SELECT * FROM users WHERE role = 'student' or role = 'pending'"
    );
  }

  static getTitleById(id) {
    return db.execute("SELECT name FROM users WHERE id = ?", [id]);
  }

  static save(user) {
    return db.execute(
      "INSERT INTO users (id, name, email, password, phone) VALUES (UUID(),?,?,?,?)",
      [user.name, user.email, user.password, user.phone]
    );
  }

  static deleteById(id) {
    return db.execute("DELETE FROM users WHERE id = ?", [id]);
  }

  static changeRole(id, role) {
    return db.execute("UPDATE users SET role = ? WHERE id = ?", [role, id]);
  }
};
