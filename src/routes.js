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

routes.get("/health", getHealth);
routes.get("/users/list", listAllUsers);
routes.get("/user/:id", listUniqueUser);

routes.use(verifiyToken);
routes.post("/user/create", createUser);
routes.delete("/user/:id", deleteUser);
routes.put("/user/edit/:id", editUniqueUser);

module.exports = routes;
