import { User } from "../../entity/user.entity";
import { RegisterRequestBody } from "./auth.types";
import { AppDataSource } from "../../server";
import { hashPassword } from "../../helpers/authHelper";

export class AuthService {
  public async registerUser(
    reqBody: RegisterRequestBody
  ): Promise<{ status: boolean; message: string }> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const em = queryRunner.manager;
    try {
      const { email, password, confirmPassword } = reqBody;
      if (!email || !password || !confirmPassword) {
        throw new Error("All fields are required");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const existingUser = await em.findOne(User, {
        where: { email: email, isActive: true },
      });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await hashPassword(password);
      await queryRunner.startTransaction();
      const newUser = em.create(User, {
        email,
        password: hashedPassword,
      });
      await em.save(newUser);
      await queryRunner.commitTransaction();
      return { status: true, message: "User registered successfully" };
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
