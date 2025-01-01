import request from "supertest";
import app, { AppDataSource } from "../server"; // Import the app for testing
import { Server } from "http";

let server: Server;

beforeAll(async () => {
  console.log("Initializing database...");
  await AppDataSource.initialize();
  server = app.listen(8080, () => {
    console.log("Test server running on port 3001");
  });
});

describe("GET /", () => {
  it("should return Hello Ankit!", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello Ankit!");
  });
});

afterAll(async () => {
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  await AppDataSource.destroy();
});
