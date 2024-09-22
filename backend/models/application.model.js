const db = require("../util/db");

module.exports = class Application {
  static getAll() {
    return db.execute("select * from applications");
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

  static delete(id) {
    return db.execute("delete from applications where id = ?", [id]);
  }
};
