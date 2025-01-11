"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const fs_1 = require("fs");
const message_entity_1 = require("../../entity/message.entity");
const user_entity_1 = require("../../entity/user.entity");
const server_1 = require("../../server");
const typeorm_1 = require("typeorm");
const channel_entity_1 = require("../../entity/channel.entity");
class ChatService {
    async getMessages(currentUserEmail, secondUserId) {
        const queryRunner = server_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const em = queryRunner.manager;
        try {
            if (!secondUserId)
                throw new Error("User not provided");
            const currentUser = await em.findOne(user_entity_1.User, {
                where: { email: currentUserEmail, isActive: true },
            });
            const secondUser = await em.findOne(user_entity_1.User, {
                where: { id: secondUserId, isActive: true },
            });
            if (!currentUser)
                throw new Error("Current User not found");
            if (!secondUser)
                throw new Error("Other User not found");
            const messages = await em.find(message_entity_1.Message, {
                where: [
                    { sender: currentUser, recipient: secondUser },
                    { sender: secondUser, recipient: currentUser },
                ],
                relations: ["sender", "recipient"],
                order: { timestamp: "ASC" },
            });
            return { status: true, messages };
        }
        catch (err) {
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async uploadFile(file) {
        const queryRunner = server_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const em = queryRunner.manager;
        try {
            if (!file)
                throw new Error("File not provided");
            const date = Date.now();
            let fileDir = `uploads/files/${date}`;
            let fileName = `${fileDir}/${file.originalname}`;
            (0, fs_1.mkdirSync)(fileDir, { recursive: true });
            (0, fs_1.renameSync)(file.path, fileName);
            return { status: true, filePath: fileName };
        }
        catch (err) {
            if (queryRunner.isTransactionActive)
                await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createChannel(currentUserEmail, members, name) {
        const queryRunner = server_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const em = queryRunner.manager;
        try {
            if (!(members === null || members === void 0 ? void 0 : members.length))
                throw new Error("Members are not provided");
            const currentUser = await em.findOne(user_entity_1.User, {
                where: { email: currentUserEmail, isActive: true },
            });
            if (!currentUser)
                throw new Error("User not found");
            const memberUsers = await em.find(user_entity_1.User, { where: { id: (0, typeorm_1.In)(members) } });
            if (memberUsers.length !== members.length)
                throw new Error("User is missing");
            await queryRunner.startTransaction();
            const newChannel = em.create(channel_entity_1.ChannelSchema, {
                channelName: name,
                admin: currentUser,
                members: memberUsers,
            });
            await em.save(newChannel);
            await queryRunner.commitTransaction();
            return { status: true, channel: newChannel };
        }
        catch (err) {
            if (queryRunner.isTransactionActive)
                await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getChannels(currentUserEmail) {
        const queryRunner = server_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const em = queryRunner.manager;
        try {
            const user = await em.findOne(user_entity_1.User, {
                where: { email: currentUserEmail, isActive: true },
            });
            if (!user)
                throw new Error("User not found");
            const channels = await em
                .createQueryBuilder(channel_entity_1.ChannelSchema, "channel")
                .leftJoinAndSelect("channel.members", "member")
                .where("channel.admin = :userId OR member.id = :userId", {
                userId: user.id,
            })
                .getMany();
            return channels;
        }
        catch (err) {
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getChannelChats(channelId) {
        const queryRunner = server_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const em = queryRunner.manager;
        try {
            const channel = await em.findOne(channel_entity_1.ChannelSchema, {
                where: { id: channelId },
            });
            if (!channel)
                throw new Error("Channel not found");
            const messages = await em.find(message_entity_1.Message, {
                where: { channelId: (0, typeorm_1.Equal)(channel.id) },
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
                order: { timestamp: "ASC" },
            });
            return { status: true, messages };
        }
        catch (err) {
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map