import { Message } from "../../entity/message.entity";
import { User } from "../../entity/user.entity";
import { AppDataSource } from "../../server";

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
}
