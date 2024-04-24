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

  static save(user) {
    return db.execute(
      "INSERT INTO users (id, name, email, password, phone) VALUES (UUID(),?,?,?,?)",
      [user.name, user.email, user.password, user.phone]
    );
  }
};
