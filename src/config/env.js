require("dotenv").config();

const requiredValues = [
  "DB_HOST",
  "DB_PASSWORD",
  "DB_NAME",
  "DB_PORT",
  "DB_USER",
];

function createConfig(environment) {
  for (const item of requiredValues) {
    if (!environment[item]) {
      throw new Error(`Variavel obrigatória ausente ${item}`);
    }
  }

  return {
    host: environment.DB_HOST,
    port: parseInt(environment.DB_PORT),
    user: environment.DB_USER,
    password: environment.DB_PASSWORD,
    database: environment.DB_NAME,
  };
}

module.exports = {
  createConfig,
};
