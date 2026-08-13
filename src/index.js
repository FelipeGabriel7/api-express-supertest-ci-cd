const { initializeDatabase } = require("./database/database");
const app = require("./app");

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
