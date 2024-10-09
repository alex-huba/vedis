const db = require("../util/db");

module.exports = class User {
  static findByEmail(email) {
    return db.execute("SELECT * FROM users WHERE email = ?", [email]);
  }

  static findById(id) {
    return db.execute("SELECT * FROM users WHERE id = ?", [id]);
  }

  static findAllStudents() {
    return db.execute(`
      SELECT id, name, email, phoneNumber, role, timezone 
      FROM users 
      WHERE role = 'student'
    `);
  }

  static getStudentsUnfiltered() {
    return db.execute(
      "SELECT * FROM users WHERE role = 'student' or role = 'pending'"
    );
  }

  static save(user) {
    return db.execute(
      "INSERT INTO users (id, name, email, password, phoneNumber, timezone) VALUES (UUID(),?,?,?,?,?)",
      [user.name, user.email, user.password, user.phoneNumber, user.timezone]
    );
  }

  static deleteById(id) {
    return db.execute("DELETE FROM users WHERE id = ?", [id]);
  }

  static update(id, name, email, phoneNumber, timezone) {
    return db.execute(
      "UPDATE users SET name = ?, email = ?, phoneNumber = ?, timezone = ? WHERE id = ?",
      [name, email, phoneNumber, timezone, id]
    );
  }

  static changePassword(id, pwd) {
    return db.execute("UPDATE users SET password =  ? WHERE id = ?", [pwd, id]);
  }

  static changeRole(id, role) {
    return db.execute("UPDATE users SET role = ? WHERE id = ?", [role, id]);
  }
};
