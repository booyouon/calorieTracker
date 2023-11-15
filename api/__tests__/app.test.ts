import request from "supertest";
import app from "../src/app"; // Assuming your Express app is exported from this file

describe("GET /", () => {
  it("should get foods", async () => {
    const response = await request(app).get("/foods");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
