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
}
