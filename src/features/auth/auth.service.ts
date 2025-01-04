import { User } from "../../entity/user.entity";
import { AuthRequestBody, AuthResponse } from "./auth.types";
import { AppDataSource } from "../../server";
import {
  comparePassword,
  hashPassword,
  validateEmail,
} from "../../helpers/authHelper";
import jwt from "jsonwebtoken";

export class AuthService {
  public async registerUser(
    reqBody: AuthRequestBody
  ): Promise<{ status: boolean; message: string; token?: string }> {
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

      if (!validateEmail(email)) {
        throw new Error("Invalid email address");
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
      const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      });
      await queryRunner.commitTransaction();
      return { status: true, message: "User registered successfully", token };
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  public async loginUser(reqBody: AuthRequestBody): Promise<AuthResponse> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const em = queryRunner.manager;
    try {
      const { email, password } = reqBody;
      if (!email || !password) {
        throw new Error("All fields are required");
      }
      const existingUser = await em.findOne(User, {
        where: { email: email, isActive: true },
      });
      if (!existingUser) {
        throw new Error("User does not exist");
      }
      const isPasswordValid = await comparePassword(
        password,
        existingUser.password
      );
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }
      const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      });
      return {
        status: true,
        message: "User logged in successfully",
        token,
        isProfileComplete: existingUser.profileSetup,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        image: existingUser.image,
        color: existingUser.color,
      };
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
