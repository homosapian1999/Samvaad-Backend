"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresSignIn = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const requiresSignIn = async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.context = user.email;
            next();
        }
        catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }
    }
    else {
        res
            .status(401)
            .json({ message: "You must be signed in to access this resource" });
    }
};
exports.requiresSignIn = requiresSignIn;
//# sourceMappingURL=authMiddleware.js.map