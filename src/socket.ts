import { Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import dotenv, { populate } from "dotenv";
import { Message } from "./entity/message.entity";
import { getRepository } from "typeorm";
import { AppDataSource } from "./server";

dotenv.config();

interface SetupSocket {
  (server: Server): void;
}

const setupSocket: SetupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // For Mapping the user id and their socket instances
  const userSocketMap = new Map();

  interface Disconnect {
    (socket: Socket): void;
  }

  const disconnect: Disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message: Message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const messageRepository = AppDataSource.getRepository(Message);
    const em = AppDataSource.manager;

    const newMessage = em.create(Message, message);
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
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User Id not provided during connection");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};
export default setupSocket;
