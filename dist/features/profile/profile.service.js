"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const message_entity_1 = require("../../entity/message.entity");
const user_entity_1 = require("../../entity/user.entity");
const server_1 = require("../../server");
const typeorm_1 = require("typeorm");
class ProfileService {
    async searchContacts(userEmail, searchTerm) {
        const queryRunner = server_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const em = queryRunner.manager;
        try {
            if (!searchTerm)
                throw new Error("No search term provided");
            const contacts = await em
                .createQueryBuilder(user_entity_1.User, "u")
                .select([
                'u.id AS "id"',
                'u.email AS "email"',
                'u.first_name AS "firstName"',
                'u.last_name AS "lastName"',
                'u.image AS "image"',
                'u.color AS "color"',
            ])
                .where("u.email != :userEmail", { userEmail: userEmail })
                .andWhere(new typeorm_1.Brackets((qb) => {
                qb.where("u.email LIKE :searchTerm", {
                    searchTerm: `%${searchTerm}%`,
                })
                    .orWhere("u.first_name LIKE :searchTerm", {
                    searchTerm: `%${searchTerm}%`,
                })
                    .orWhere("u.last_name LIKE :searchTerm", {
                    searchTerm: `%${searchTerm}%`,
                });
            }))
                .getRawMany();
            return { status: true, contacts };
        }
        catch (err) {
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getContactsListForDM(currentUserEmailId) {
        const queryRunner = server_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const em = queryRunner.manager;
        try {
            const currentUser = await em.findOne(user_entity_1.User, {
                where: { email: currentUserEmailId, isActive: true },
            });
            const contacts = await em
                .createQueryBuilder(user_entity_1.User, "u")
                .leftJoin(message_entity_1.Message, "m", "(m.sender_id = u.id or m.recipient_id = u.id)")
                .where("u.id != :currentUserId", {
                currentUserId: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id,
            })
                .andWhere(":currentUserId IN (m.sender_id, m.recipient_id)", {
                currentUserId: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id,
            })
                .groupBy("u.id")
                .orderBy("MAX(m.timestamp)", "DESC")
                .getMany();
            return { status: true, contacts };
        }
        catch (err) {
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getAllContacts(currentUserEmail) {
        const queryRunner = server_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const em = queryRunner.manager;
        try {
            const users = await em
                .createQueryBuilder(user_entity_1.User, "u")
                .select([
                'u.id as "id"',
                'u.first_name as "firstName"',
                'u.last_name as "lastName"',
                'u.email as "email"',
            ])
                .where("u.email != :currentUserEmail", {
                currentUserEmail: currentUserEmail,
            })
                .andWhere("u.is_active = :status", { status: true })
                .getRawMany();
            const contacts = users.map((user) => ({
                label: user.firstName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email,
                value: user.id,
            }));
            return { status: true, contacts };
        }
        catch (err) {
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.ProfileService = ProfileService;
//# sourceMappingURL=profile.service.js.map