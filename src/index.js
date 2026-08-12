const express = require("express");
const routes = require("./routes");
const { initializeDatabase } = require("./database/database");

const app = express();
app.use(express.json());
app.use(routes);

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(3001, () => {
      console.log("Servidor iniciado na porta 3001");
    });
  } catch (e) {
    console.error("Não foi possível iniciar a aplicação", e);
    process.exit(1);
  }
}

startServer();
