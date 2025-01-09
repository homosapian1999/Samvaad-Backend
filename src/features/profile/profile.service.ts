import { Message } from "../../entity/message.entity";
import { User } from "../../entity/user.entity";
import { AppDataSource } from "../../server";
import { Brackets } from "typeorm";

export class ProfileService {
  public async searchContacts(userEmail: string, searchTerm: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const em = queryRunner.manager;
    try {
      if (!searchTerm) throw new Error("No search term provided");
      console.log(userEmail);

      const contacts: User[] = await em
        .createQueryBuilder(User, "u")
        .select([
          'u.id AS "id"',
          'u.email AS "email"',
          'u.first_name AS "firstName"',
          'u.last_name AS "lastName"',
          'u.image AS "image"',
          'u.color AS "color"',
        ])
        .where("u.email != :userEmail", { userEmail: userEmail })
        .andWhere(
          new Brackets((qb) => {
            qb.where("u.email LIKE :searchTerm", {
              searchTerm: `%${searchTerm}%`,
            })
              .orWhere("u.first_name LIKE :searchTerm", {
                searchTerm: `%${searchTerm}%`,
              })
              .orWhere("u.last_name LIKE :searchTerm", {
                searchTerm: `%${searchTerm}%`,
              });
          })
        )
        .getRawMany();

      return { status: true, contacts };
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async getContactsListForDM(currentUserEmailId: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const em = queryRunner.manager;
    try {
      const contacts = await em
        .createQueryBuilder(User, "u")
        .leftJoin(Message, "m", "(m.sender_id = u.id or m.recipient_id = u.id)")
        .where("u.email != :currentUserEmail", {
          currentUserEmail: currentUserEmailId,
        })
        .andWhere("(m.sender_id IS NOT NULL OR m.recipient_id IS NOT NULL)")
        .groupBy("u.id")
        .orderBy("MAX(m.timestamp)", "DESC")
        .getMany();
      return { status: true, contacts };
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
