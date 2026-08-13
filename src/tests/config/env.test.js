const { createConfig } = require("../../config/env");

const validEnvironment = {
  DB_HOST: "localhost",
  DB_PORT: "3306",
  DB_USER: "root",
  DB_PASSWORD: "senha_de_teste",
  DB_NAME: "usuarios_crud",
};

const requiredVariables = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
];

for (const variableName of requiredVariables) {
  test(`rejeita configuração sem ${variableName}`, () => {
    const environment = { ...validEnvironment };

    delete environment[variableName];

    expect(() => createConfig(environment)).toThrow(new RegExp(variableName));
  });
}

test("retorna a configuração formatada para o MySQL", () => {
  const config = createConfig(validEnvironment);

  expect(config).toEqual({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "senha_de_teste",
    database: "usuarios_crud",
  });
});
