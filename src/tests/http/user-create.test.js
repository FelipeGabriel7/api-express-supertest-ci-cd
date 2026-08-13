const request = require("supertest");
const app = require("../../app");
const UserModel = require("../../models/userModel");

describe("POST /user/create", () => {
  test("Cria um novo usuário válido", async () => {
    const payload = {
      name: "Felipe",
      age: 23,
    };

    const createdUser = {
      id: 1,
      ...payload,
    };

    UserModel.create.mockResolvedValue(createdUser);
    const response = await request(app)
      .post("/user/create")
      .set("Authorization", "Bearer token-de-teste")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual(createdUser);
    expect(UserModel.create).toHaveBeenCalledWith("Felipe", 23);
  });

  test("Cria um novo usuário inválido retornando um erro 500", async () => {
    const error = new Error("Erro simulado!");
    jest.spyOn(console, "error").mockImplementation(() => {});

    const payload = {
      name: "Felipe",
      age: 23,
    };

    UserModel.create.mockRejectedValue(error);

    const response = await request(app)
      .post("/user/create")
      .set("Authorization", "Bearer token-de-teste")
      .send(payload);

    expect(response.status).toBe(500);
    expect(response.type).toBe("application/json");
    expect(response.body).toBe("Erro 500 do servidor");
    expect(UserModel.create).toHaveBeenCalledWith("Felipe", 23);
  });
});
