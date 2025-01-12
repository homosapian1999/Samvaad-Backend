import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./features/auth/auth.routes";
import morgan from "morgan";
import { profileRouter } from "./features/profile/profile.routes";
import { createServer } from "http";
import setupSocket from "./socket";
import { chatRouter } from "./features/chat/chat.routes";

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
    origin: "https://samvaad-frontend.vercel.app",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

// app.use("/uploads/profiles", express.static("uploads/profiles"));
// app.use("/uploads/files", express.static("uploads/files"));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/chat", chatRouter);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "aws-0-ap-south-1.pooler.supabase.com",
  port: 6543,
  username: "postgres.lgmjtakrqyrwrnwtcppp",
  password: "mC!uL!VVp.e9v$z",
  database: "postgres",
  synchronize: true,
  logging: true,
  entities:
    process.env.NODE_ENV === "production"
      ? ["dist/entity/**/*.js"]
      : ["src/entity/**/*.ts"], // Use .ts for local dev
  migrations:
    process.env.NODE_ENV === "production"
      ? ["dist/migration/**/*.js"]
      : ["src/migration/**/*.ts"],
  ssl: { rejectUnauthorized: false },
  extra: {
    max: 5,
    connectionTimeoutMillis: 3000,
  },
});

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: process.env.DB_HOST as string,
//   port: process.env.DB_PORT as unknown as number,
//   username: process.env.DB_USER as string,
//   password: process.env.DB_PASSWORD as string,
//   database: process.env.DB_NAME as string,
//   synchronize: true,
//   logging: false,
//   entities: ["src/entity/**/*.ts"],
//   migrations: ["src/migration/**/*.ts"],
//   ssl: { rejectUnauthorized: false },
// });

app.get("/", (req, res) => {
  res.send("Hello Ankit!");
});

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Connected to the database");
    const server = createServer(app);
    setupSocket(server);
    server.listen(port, () => {
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
