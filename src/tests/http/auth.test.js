const request = require("supertest");
const app = require("../../app");

const protectedRoutes = [
  {
    method: "post",
    path: "/user/create",
    body: { name: "Felipe", age: 23 },
  },
  {
    method: "put",
    path: "/user/edit/1",
    body: { name: "Felipe", age: 30 },
  },
  {
    method: "delete",
    path: "/user/1",
  },
];

describe("Autorização em rotas protegidas", () => {
  test.each(protectedRoutes)(
    "$method $path retorna 401 sem autorização",
    async ({ method, path, body }) => {
      const httpRequest = request(app)[method](path);

      if (body) httpRequest.send(body);

      const response = await httpRequest;

      expect(response.status).toBe(401);
      expect(response.type).toBe("application/json");
      expect(response.body).toBe("Token inválido, não autorizado");
    },
  );
});
