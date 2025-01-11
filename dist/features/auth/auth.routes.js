"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
const upload = (0, multer_1.default)();
authRouter.post("/register", auth_controller_1.AuthController.registerUser);
authRouter.post("/login", auth_controller_1.AuthController.loginUser);
authRouter.get("/user-info", authMiddleware_1.requiresSignIn, auth_controller_1.AuthController.getUserInfo);
authRouter.post("/update-profile", authMiddleware_1.requiresSignIn, auth_controller_1.AuthController.updateProfile);
authRouter.post("/add-profile-image", authMiddleware_1.requiresSignIn, upload.single("profile-image"), auth_controller_1.AuthController.addProfileImage);
authRouter.delete("/remove-profile-image", authMiddleware_1.requiresSignIn, auth_controller_1.AuthController.deleteProfileImage);
authRouter.post("/logout", authMiddleware_1.requiresSignIn, auth_controller_1.AuthController.logout);
//# sourceMappingURL=auth.routes.js.map