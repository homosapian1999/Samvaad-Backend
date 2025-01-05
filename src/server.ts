import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./features/auth/auth.routes";
import morgan from "morgan";

declare global {
  namespace Express {
    interface Request {
      context: string;
    }
  }
}

dotenv.config();
const app = express();
app.use(express.json());
const port = parseInt(process.env.PORT as string, 10);

// Note: If more than one frontend is consuming the API, you can add the frontend URLs to the origin array.
app.use(
  cors({
    origin: [process.env.ORIGIN as string],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/auth", authRouter);

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
});

app.get("/", (req, res) => {
  res.send("Hello Ankit!");
});

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error(`Error while setting up the database: ${error}`);
  }
};
if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
