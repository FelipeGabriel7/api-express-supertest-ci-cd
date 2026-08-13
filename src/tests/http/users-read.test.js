const request = require("supertest");
const app = require("../../app");
const UserModel = require("../../models/userModel");

describe("GET /users/list", () => {
  test("retorna a lista de usuários", async () => {
    // Arrange
    const users = [
      { id: 1, name: "Felipe", age: 23 },
      { id: 2, name: "Ana", age: 30 },
    ];

    UserModel.findAll.mockResolvedValue(users);

    // Act
    const response = await request(app).get("/users/list");

    // Assert
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual(users);
  });

  test("retorna 500 quando a consulta de usuários falha", async () => {
    // Arrange
    const databaseError = new Error("falha simulada");

    jest.spyOn(console, "error").mockImplementation(() => {});
    UserModel.findAll.mockRejectedValue(databaseError);

    // Act
    const response = await request(app).get("/users/list");

    // Assert
    expect(response.status).toBe(500);
    expect(response.type).toBe("application/json");
    expect(response.body).toBe("Erro 500 do servidor");
  });
});

describe("GET /user/:id", () => {
  test("retorna o usuário solicitado", async () => {
    const user = {
      id: 7,
      name: "Felipe",
      age: 23,
    };

    UserModel.findById.mockResolvedValue(user);
    const response = await request(app).get("/user/7");

    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual(user);
    expect(UserModel.findById).toHaveBeenCalledWith(7);
  });

  test("não encontra o usuario solicitado", async () => {
    const user = {
      id: 99,
      name: "teste",
      age: 23,
    };

    UserModel.findById.mockResolvedValue(undefined);
    const response = await request(app).get("/user/99");

    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body).toBe("Usuário não existe");
    expect(UserModel.findById).toHaveBeenCalledWith(99);
  });

  test("retorna 500 quando a busca do usuário falha", async () => {
    const userError = new Error("Falha simulada!");

    jest.spyOn(console, "error").mockImplementation(() => {});
    UserModel.findById.mockRejectedValue(userError);
    const response = await request(app).get("/user/7");

    expect(response.status).toBe(500);
    expect(response.type).toBe("application/json");
    expect(response.body).toBe("Erro 500 no servidor");
    expect(UserModel.findById).toHaveBeenCalledWith(7);
  });
});
