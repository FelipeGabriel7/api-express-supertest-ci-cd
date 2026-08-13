const request = require("supertest");
const app = require("../../app");
const UserModel = require("../../models/userModel");

describe("POST /user/edit/:id", () => {
  test("Edita um novo usuário válido", async () => {
    const payload = {
      name: "Felipe",
      age: 23,
    };

    const updatedUser = {
      id: 4,
      ...payload,
    };

    UserModel.update.mockResolvedValue(updatedUser);
    const response = await request(app)
      .put("/user/edit/4")
      .set("Authorization", "Bearer token-de-teste")
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual(updatedUser);
    expect(UserModel.update).toHaveBeenCalledWith(4, payload.name, payload.age);
  });

  test("Edita um usuário que não existe", async () => {
    const payload = {
      name: "Felipe",
      age: 23,
    };

    const updatedUser = {
      id: 99,
      ...payload,
    };

    UserModel.update.mockResolvedValue(undefined);
    const response = await request(app)
      .put("/user/edit/99")
      .set("Authorization", "Bearer token-de-teste")
      .send(payload);

    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual("Usuario não encontrado");
    expect(UserModel.update).toHaveBeenCalledWith(
      99,
      payload.name,
      payload.age,
    );
  });

  test("Erro ao tentar editar um usuário", async () => {
    const editError = new Error("Erro simulado!");
    jest.spyOn(console, "error").mockImplementation(() => {});

    const updatedUser = {
      id: 99,
      name: "Felipe",
      age: 23,
    };

    UserModel.update.mockRejectedValue(editError);
    const response = await request(app)
      .put("/user/edit/99")
      .set("Authorization", "Bearer token-de-teste")
      .send(updatedUser);

    expect(response.status).toBe(500);
    expect(response.type).toBe("application/json");
    expect(response.body).toBe("Erro 500 do servidor");
    expect(UserModel.update).toHaveBeenCalledWith(
      99,
      updatedUser.name,
      updatedUser.age,
    );
  });
});
