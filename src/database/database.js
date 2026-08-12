const mysql = require("mysql");
const { createConfig } = require("../config/env");

const env = createConfig(process.env);

const connection = mysql.createConnection(env);

const createTableQuery = `
 CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      age INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
`;

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    connection.connect((connectionError) => {
      if (connectionError) {
        return reject(connectionError);
      }

      console.log("Banco de dados conectado");

      connection.query(createTableQuery, (queryError) => {
        if (queryError) {
          return reject(queryError);
        }

        console.log("Tabela users configurada");
        resolve();
      });
    });
  });
}

module.exports = {
  connection,
  initializeDatabase,
};
