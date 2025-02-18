import { mkdirSync, renameSync } from "fs";
import { Message } from "../../entity/message.entity";
import { User } from "../../entity/user.entity";
import { AppDataSource } from "../../server";
import { Equal, In } from "typeorm";
import { ChannelSchema } from "../../entity/channel.entity";
import supabase from "../../supabase";

export class ChatService {
  public async getMessages(currentUserEmail: string, secondUserId: number) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const em = queryRunner.manager;
    try {
      if (!secondUserId) throw new Error("User not provided");

      const currentUser = await em.findOne(User, {
        where: { email: currentUserEmail, isActive: true },
      });
      const secondUser = await em.findOne(User, {
        where: { id: secondUserId, isActive: true },
      });

      if (!currentUser) throw new Error("Current User not found");
      if (!secondUser) throw new Error("Other User not found");

      const messages = await em.find(Message, {
        where: [
          { sender: currentUser, recipient: secondUser },
          { sender: secondUser, recipient: currentUser },
        ],
        relations: ["sender", "recipient"],
        order: { timestamp: "ASC" },
      });
      return { status: true, messages };
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  public async uploadFile(file: Express.Multer.File) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const em = queryRunner.manager;
    try {
      if (!file) throw new Error("File not provided");

      const { data, error } = await supabase.storage
        .from("chat-files")
        .upload(`files/${Date.now()}_${file.originalname}`, file.buffer);

      if (error) throw new Error(`Upload error: ${error.message}`);

      const response = supabase.storage
        .from("chat-files")
        .getPublicUrl(data?.path as string);

      const publicUrl = response.data.publicUrl;

      if (!publicUrl) throw new Error("Error generating public URL");

      return { status: true, filePath: publicUrl };
    } catch (err) {
      if (queryRunner.isTransactionActive)
        await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  public async createChannel(
    currentUserEmail: string,
    members: number[],
    name: string
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const em = queryRunner.manager;
    try {
      if (!members?.length) throw new Error("Members are not provided");

      const currentUser = await em.findOne(User, {
        where: { email: currentUserEmail, isActive: true },
      });
      if (!currentUser) throw new Error("User not found");

      const memberUsers = await em.find(User, { where: { id: In(members) } });
      if (memberUsers.length !== members.length)
        throw new Error("User is missing");

      await queryRunner.startTransaction();
      const newChannel = em.create(ChannelSchema, {
        channelName: name,
        admin: currentUser,
        members: memberUsers,
      });
      await em.save(newChannel);
      await queryRunner.commitTransaction();
      return { status: true, channel: newChannel };
    } catch (err) {
      if (queryRunner.isTransactionActive)
        await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async getChannels(currentUserEmail: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const em = queryRunner.manager;
    try {
      const user = await em.findOne(User, {
        where: { email: currentUserEmail, isActive: true },
      });
      if (!user) throw new Error("User not found");

      const channels = await em
        .createQueryBuilder(ChannelSchema, "channel")
        .leftJoinAndSelect("channel.members", "member")
        .where("channel.admin = :userId OR member.id = :userId", {
          userId: user.id,
        })
        .getMany();
      return channels;
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async getChannelChats(channelId: number) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const em = queryRunner.manager;
    try {
      const channel = await em.findOne(ChannelSchema, {
        where: { id: channelId },
      });
      if (!channel) throw new Error("Channel not found");
      const messages = await em.find(Message, {
        where: { channelId: Equal(channel.id) },
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
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
