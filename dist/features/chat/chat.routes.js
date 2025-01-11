"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const chat_controller_1 = require("./chat.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const chatRouter = (0, express_1.Router)();
exports.chatRouter = chatRouter;
const upload = (0, multer_1.default)({ dest: "uploads/files" });
chatRouter.post("/get-messages", authMiddleware_1.requiresSignIn, chat_controller_1.ChatController.getMessages);
chatRouter.post("/upload-file", authMiddleware_1.requiresSignIn, upload.single("file"), chat_controller_1.ChatController.uploadFile);
chatRouter.post("/create-channel", authMiddleware_1.requiresSignIn, chat_controller_1.ChatController.createChannel);
chatRouter.get("/get-channels", authMiddleware_1.requiresSignIn, chat_controller_1.ChatController.getAllChannels);
chatRouter.get("/get-channel-messages/:channelId", authMiddleware_1.requiresSignIn, chat_controller_1.ChatController.getChannelMessages);
//# sourceMappingURL=chat.routes.js.map