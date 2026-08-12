const { connection } = require("../database/database");

class UserModel {
  static findAll() {
    return new Promise((resolve, reject) => {
      const sql = `
                SELECT * FROM users ORDER BY id ASC
            `;

      connection.query(sql, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
            SELECT * FROM users WHERE id = ? LIMIT 1
        `;

      connection.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  }

  static create(name, age) {
    return new Promise((resolve, reject) => {
      const sql = `
            INSERT INTO users(name, age) VALUES (?, ?)
        `;

      connection.query(sql, [name, age], (err, result) => {
        if (err) return reject(err);
        resolve({
          id: result.insertId,
          name,
          age,
        });
      });
    });
  }

  static update(id, name, age) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE users SET name = ?, age = ? WHERE id = ?`;

      connection.query(sql, [name, age, id], (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) return resolve(undefined);

        UserModel.findById(id).then(resolve).catch(reject);
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM users Where id = ?`;

      connection.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
}

module.exports = UserModel;
