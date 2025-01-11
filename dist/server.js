"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = require("./features/auth/auth.routes");
const morgan_1 = __importDefault(require("morgan"));
const profile_routes_1 = require("./features/profile/profile.routes");
const http_1 = require("http");
const socket_1 = __importDefault(require("./socket"));
const chat_routes_1 = require("./features/chat/chat.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = parseInt(process.env.PORT, 10);
// Note: If more than one frontend is consuming the API, you can add the frontend URLs to the origin array.
app.use((0, cors_1.default)({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
}));
// app.use("/uploads/profiles", express.static("uploads/profiles"));
// app.use("/uploads/files", express.static("uploads/files"));
app.use((0, cookie_parser_1.default)());
if (process.env.NODE_ENV === "development")
    app.use((0, morgan_1.default)("dev"));
app.use("/auth", auth_routes_1.authRouter);
app.use("/profile", profile_routes_1.profileRouter);
app.use("/chat", chat_routes_1.chatRouter);
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
        await exports.AppDataSource.initialize();
        console.log("Connected to the database");
        const server = (0, http_1.createServer)(app);
        (0, socket_1.default)(server);
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error(`Error while setting up the database: ${error}`);
    }
};
if (process.env.NODE_ENV !== "test") {
    startServer();
}
exports.default = app;
//# sourceMappingURL=server.js.map