const express = require("express");
const routes = require("./routes");

const app = express();

// Tipo de comunicação -> express.json, padrão de retorno json
app.use(express.json());
app.use(routes);

// porta que o servidor vai rodar
console.log("Servidor Iniciado...");
app.listen(3001);
