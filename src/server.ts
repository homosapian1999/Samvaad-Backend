import express from "express";
import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();
const app = express();
const port = parseInt(process.env.PORT as string, 10);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST as string,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});

AppDataSource.initialize()
  .then(() => {
    if (process.env.NODE_ENV !== "test")
      console.log("Connected to the database");
    app.use(express.json());
    app.get("/", (req: any, res: { send: (arg0: string) => void }) => {
      res.send("Hello Ankit!");
    });

    if (process.env.NODE_ENV !== "test") {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    }
  })
  .catch((error: any) =>
    console.log(`Error while setting up the database ${error}`)
  );

export default app;
