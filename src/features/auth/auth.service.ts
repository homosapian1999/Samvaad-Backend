import { User } from "../../entity/user.entity";
import { AuthRequestBody, AuthResponse, UpdateProfile } from "./auth.types";
import { AppDataSource } from "../../server";
import {
  comparePassword,
  hashPassword,
  validateEmail,
} from "../../helpers/authHelper";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";

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
        email: existingUser.email,
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
  public async getUserInfo(userEmail: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const em = queryRunner.manager;
    try {
      const user = await em.findOne(User, {
        where: { email: userEmail, isActive: true },
      });
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      if (queryRunner.isTransactionActive)
        await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  public async updateProfile(reqBody: UpdateProfile) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const em = queryRunner.manager;
    try {
      const { userEmail, firstName, lastName, color } = reqBody;
      if (!userEmail || !firstName || !lastName)
        throw new Error("Mandatory parameters are missing");

      const existingUser = await em.findOne(User, {
        where: { email: userEmail, isActive: true },
      });
      if (!existingUser) throw new Error("No user is found");

      await queryRunner.startTransaction();

      await em.update(
        User,
        { email: userEmail },
        {
          firstName,
          lastName,
          color,
          profileSetup: true,
        }
      );

      await queryRunner.commitTransaction();
      return { status: true, message: "User details updates successfully" };
    } catch (err) {
      if (queryRunner.isTransactionActive)
        await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  public async addProfileImage(userEmail: string, file: Express.Multer.File) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const em = queryRunner.manager;
    try {
      if (!file) throw new Error("File not provided");
      const date = Date.now();
      let fileName = "uploads/profiles/" + date + file.originalname;
      const filePath = (file as any).path;
      if (!filePath) throw new Error("File path not found");
      renameSync(filePath, fileName);

      const user = await em.findOne(User, {
        where: { email: userEmail, isActive: true },
      });
      if (!user) throw new Error("User not found");

      await queryRunner.startTransaction();

      await em.update(User, { email: user.email }, { image: fileName });

      await queryRunner.commitTransaction();
      return {
        status: true,
        message: "Image Uploaded Successfully",
        image: user.image,
      };
    } catch (err) {
      if (queryRunner.isTransactionActive)
        await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  public async removeProfileImage(userEmail: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const em = queryRunner.manager;
    try {
      if (!userEmail) throw new Error("User email not provided ");
      const user = await em.findOne(User, {
        where: { email: userEmail, isActive: true },
      });
      if (!user) throw new Error("No user found");
      await queryRunner.startTransaction();
      if (user.image) unlinkSync(user.image);
      user.image = null as unknown as string;
      em.save(user);

      await queryRunner.commitTransaction();
      return { status: true, message: "User deleted successfully" };
    } catch (err) {
      if (queryRunner.isTransactionActive)
        await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  public async logout() {
    try {
      return { status: true, message: "Logout successful" };
    } catch (err) {
      throw err;
    }
  }
}
