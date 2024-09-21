const db = require("../util/db");

module.exports = class Application {
  static getAll() {
    return db.execute("select * from applications");
  }

  static getUnprocessed() {
    return db.execute("select * from applications where processed = false")
  }

  static save(name, email, course, phoneNumber, howToConnect, createdAt) {
    return db.execute(
      `
        insert into applications 
          (id, name, email, course, phoneNumber, howToConnect, createdAt)
        values 
          (UUID(), ?,?,?,?,?,?)`,
      [name, email, course, phoneNumber, howToConnect, createdAt]
    );
  }

  static update(id, processed) {
    return db.execute("update applications set processed = ? where id = ?", [
      processed,
      id,
    ]);
  }
};
