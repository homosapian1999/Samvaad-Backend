"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_entity_1 = require("../../entity/user.entity");
const server_1 = require("../../server");
const authHelper_1 = require("../../helpers/authHelper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supabase_1 = __importDefault(require("../../supabase"));
class AuthService {
    async registerUser(reqBody) {
        const queryRunner = server_1.AppDataSource.createQueryRunner();
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
            if (!(0, authHelper_1.validateEmail)(email)) {
                throw new Error("Invalid email address");
            }
            const existingUser = await em.findOne(user_entity_1.User, {
                where: { email: email, isActive: true },
            });
            if (existingUser) {
                throw new Error("User already exists");
            }
            const hashedPassword = await (0, authHelper_1.hashPassword)(password);
            await queryRunner.startTransaction();
            const newUser = em.create(user_entity_1.User, {
                email,
                password: hashedPassword,
                profileSetup: true,
            });
            await em.save(newUser);
            const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
            await queryRunner.commitTransaction();
            return {
                status: true,
                message: "User registered successfully",
                token,
                profileSetup: newUser.profileSetup,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                image: newUser.image,
                color: newUser.color,
                email: newUser.email,
            };
        }
        catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async loginUser(reqBody) {
        const queryRunner = server_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const em = queryRunner.manager;
        try {
            const { email, password } = reqBody;
            if (!email || !password) {
                throw new Error("All fields are required");
            }
            const existingUser = await em.findOne(user_entity_1.User, {
                where: { email: email, isActive: true },
            });
            if (!existingUser) {
                throw new Error("User does not exist");
            }
            const isPasswordValid = await (0, authHelper_1.comparePassword)(password, existingUser.password);
            if (!isPasswordValid) {
                throw new Error("Invalid password");
            }
            const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
            return {
                status: true,
                message: "User logged in successfully",
                token,
                profileSetup: existingUser.profileSetup,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                image: existingUser.image,
                color: existingUser.color,
                email: existingUser.email,
            };
        }
        catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getUserInfo(userEmail) {
        const queryRunner = server_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const em = queryRunner.manager;
        try {
            const user = await em.findOne(user_entity_1.User, {
                where: { email: userEmail, isActive: true },
            });
            if (!user)
                throw new Error("User not found");
            return user;
        }
        catch (error) {
            if (queryRunner.isTransactionActive)
                await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateProfile(reqBody) {
        const queryRunner = server_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const em = queryRunner.manager;
        try {
            const { userEmail, firstName, lastName, color } = reqBody;
            if (!userEmail || !firstName || !lastName)
                throw new Error("Mandatory parameters are missing");
            const existingUser = await em.findOne(user_entity_1.User, {
                where: { email: userEmail, isActive: true },
            });
            if (!existingUser)
                throw new Error("No user is found");
            await queryRunner.startTransaction();
            await em.update(user_entity_1.User, { email: userEmail }, {
                firstName,
                lastName,
                color,
                profileSetup: true,
            });
            await queryRunner.commitTransaction();
            return { status: true, message: "User details updates successfully" };
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
    async addProfileImage(userEmail, file) {
        const queryRunner = server_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const em = queryRunner.manager;
        try {
            if (!file)
                throw new Error("File not provided");
            const { data, error } = await supabase_1.default.storage
                .from("profile-images")
                .upload(`profiles/${Date.now()}_${file.originalname}`, file.buffer);
            if (error)
                throw new Error(`Upload error: ${error.message}`);
            const response = supabase_1.default.storage
                .from("profile-images")
                .getPublicUrl(data === null || data === void 0 ? void 0 : data.path);
            const publicUrl = response.data.publicUrl;
            if (!publicUrl)
                throw new Error("Error generating public URL");
            const user = await em.findOne(user_entity_1.User, {
                where: { email: userEmail, isActive: true },
            });
            if (!user)
                throw new Error("User not found");
            await queryRunner.startTransaction();
            await em.update(user_entity_1.User, { email: user.email }, { image: publicUrl });
            await queryRunner.commitTransaction();
            return {
                status: true,
                message: "Image Uploaded Successfully",
                image: publicUrl,
            };
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
    async removeProfileImage(userEmail) {
        const queryRunner = server_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const em = queryRunner.manager;
        try {
            if (!userEmail)
                throw new Error("User email not provided ");
            const user = await em.findOne(user_entity_1.User, {
                where: { email: userEmail, isActive: true },
            });
            if (!user)
                throw new Error("No user found");
            await queryRunner.startTransaction();
            if (user.image) {
                const fileName = user.image.split("/").pop();
                const { error } = await supabase_1.default.storage
                    .from("profile-images")
                    .remove([`profiles/${fileName}`]);
                if (error)
                    throw new Error(`Delete error: ${error.message}`);
                user.image = null;
                await em.save(user);
            }
            await queryRunner.commitTransaction();
            return { status: true, message: "User deleted successfully" };
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
    async logout() {
        try {
            return { status: true, message: "Logout successful" };
        }
        catch (err) {
            throw err;
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map