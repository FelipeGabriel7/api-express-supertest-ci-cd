const request = require("supertest");
const app = require("../../app");
const UserModel = require("../../models/userModel");

describe("DELETE /user/:id", () => {
  test("Deleta um usuário válido", async () => {
    UserModel.delete.mockResolvedValue(true);
    const response = await request(app)
      .delete("/user/8")
      .set("Authorization", "Bearer token-test");

    expect(response.status).toBe(204);
    expect(response.text).toBe("");
    expect(UserModel.delete).toHaveBeenCalledWith(8);
  });

  test("Deleta um usuário inexistente", async () => {
    UserModel.delete.mockResolvedValue(undefined);
    const response = await request(app)
      .delete("/user/8")
      .set("Authorization", "Bearer token-test");

    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body).toBe("Usuário não encontrado");
    expect(UserModel.delete).toHaveBeenCalledWith(8);
  });

  test("Erro 500 ao tentar excluir um usuário", async () => {
    const deleteError = new Error("Falha simulada!");
    jest.spyOn(console, "error").mockImplementation(() => {});
    UserModel.delete.mockRejectedValue(deleteError);
    const response = await request(app)
      .delete("/user/8")
      .set("Authorization", "Bearer token-test");

    expect(response.status).toBe(500);
    expect(response.type).toBe("application/json");
    expect(response.body).toBe("Erro 500 do servidor");
    expect(UserModel.delete).toHaveBeenCalledWith(8);
  });
});
