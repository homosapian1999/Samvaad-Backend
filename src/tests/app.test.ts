import request from "supertest";
import app, { AppDataSource } from "../server"; // Import the app for testing
import { Server } from "http";

let server: Server;
// beforeAll((done) => {
//   AppDataSource.initialize().then(() => {
//     server = app.listen(done);
//   });
// });

beforeAll(async () => {
  await AppDataSource.initialize();
  server = app.listen();
});
afterAll(async () => {
  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
    await AppDataSource.destroy();
  } catch (error) {
    console.error(`Error while tearing down the database: ${error}`);
  }
});

describe("GET /", () => {
  it("should return Hello Ankit!", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello Ankit!");
  });
});
