"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chat_service_1 = require("./chat.service");
class ChatController {
    static async getMessages(req, res) {
        try {
            const userEmail = req.context;
            const { secondUserId } = req.body;
            const result = await new chat_service_1.ChatService().getMessages(userEmail, secondUserId);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                status: false,
                message: "Error while getting user info " + error,
            });
        }
    }
    static async uploadFile(req, res) {
        try {
            const file = req.file;
            const result = await new chat_service_1.ChatService().uploadFile(file);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                status: false,
                message: "Error while getting user info " + error,
            });
        }
    }
    static async createChannel(req, res) {
        try {
            const userEmail = req.context;
            const { members, name } = req.body;
            const result = await new chat_service_1.ChatService().createChannel(userEmail, members, name);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                status: false,
                message: "Error while getting user info " + error,
            });
        }
    }
    static async getAllChannels(req, res) {
        try {
            const userEmail = req.context;
            const result = await new chat_service_1.ChatService().getChannels(userEmail);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                status: false,
                message: "Error while getting user info " + error,
            });
        }
    }
    static async getChannelMessages(req, res) {
        try {
            const channelId = parseInt(req.params.channelId, 10);
            const result = await new chat_service_1.ChatService().getChannelChats(channelId);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                status: false,
                message: "Error while getting user info " + error,
            });
        }
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map