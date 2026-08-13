const request = require("supertest");
const app = require("../../app");

describe("GET /health", () => {
  test("retorna o contrato de saúde da API", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toBe("OK! Status check");
  });
});
