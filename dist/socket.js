"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const message_entity_1 = require("./entity/message.entity");
const server_1 = require("./server");
const channel_entity_1 = require("./entity/channel.entity");
dotenv_1.default.config();
const setupSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    // For Mapping the user id and their socket instances
    const userSocketMap = new Map();
    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };
    const sendChannelMessage = async (message) => {
        const { channelId } = message;
        const messageRepository = server_1.AppDataSource.getRepository(message_entity_1.Message);
        const em = server_1.AppDataSource.manager;
        const newMessage = em.create(message_entity_1.Message, message);
        const createdMessage = await messageRepository.save(newMessage);
        const messageData = await messageRepository.findOne({
            where: { id: createdMessage.id },
            relations: ["sender"],
            select: {
                sender: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    image: true,
                    color: true,
                },
            },
        });
        const channel = await em.findOne(channel_entity_1.ChannelSchema, {
            where: { id: channelId },
            relations: ["members", "admin"],
            select: { members: true },
        });
        const finalData = Object.assign(Object.assign({}, messageData), { channelId: channel === null || channel === void 0 ? void 0 : channel.id });
        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member.id);
                if (memberSocketId) {
                    io.to(memberSocketId).emit("receive-channel-message", finalData);
                }
            });
            const adminSocketId = userSocketMap.get(channel.admin.id);
            if (adminSocketId) {
                io.to(adminSocketId).emit("receive-channel-message", finalData);
            }
        }
    };
    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
        const messageRepository = server_1.AppDataSource.getRepository(message_entity_1.Message);
        const em = server_1.AppDataSource.manager;
        const newMessage = em.create(message_entity_1.Message, message);
        const createdMessage = await messageRepository.save(newMessage);
        const messageData = await messageRepository.findOne({
            where: { id: createdMessage.id },
            relations: ["sender", "recipient"],
            select: {
                sender: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    image: true,
                    color: true,
                },
                recipient: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    image: true,
                    color: true,
                },
            },
        });
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", messageData);
        }
    };
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(Number(userId), socket.id);
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
        }
        else {
            console.log("User Id not provided during connection");
        }
        socket.on("sendMessage", sendMessage);
        socket.on("send-channel-message", sendChannelMessage);
        socket.on("disconnect", () => disconnect(socket));
    });
};
exports.default = setupSocket;
//# sourceMappingURL=socket.js.map