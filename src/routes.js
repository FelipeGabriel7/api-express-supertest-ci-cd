const { Router } = require("express");
const {
  createUser,
  listAllUsers,
  listUniqueUser,
  deleteUser,
  editUniqueUser,
} = require("./controllers/users.js");
const { getHealth } = require("./controllers/health.js");
const { verifiyToken } = require("./middlewares/AuthMiddleware.js");

const routes = Router();

routes.get("/health", (req, res) => {
  getHealth(req, res);
});

let users = [];

// lista todos os usuários
routes.get("/users/list", (req, res) => {
  listAllUsers(req, res);
});

// busca um unico usuário
routes.get("/user/:id", (req, res) => {
  listUniqueUser(req, res);
});

// cria uma rota pra salvar um user
routes.post("/user/create", verifiyToken, (req, res) => {
  createUser(req, res);
});

routes.delete("/user/:id", verifiyToken, (req, res) => {
  deleteUser(req, res);
});

// rota para atualizar um usuário
routes.put("/user/edit/:id", verifiyToken, (req, res) => {
  editUniqueUser(req, res);
});

module.exports = routes;
