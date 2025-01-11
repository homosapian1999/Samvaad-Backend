"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelSchema = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let ChannelSchema = class ChannelSchema {
};
exports.ChannelSchema = ChannelSchema;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChannelSchema.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "channel_name" }),
    __metadata("design:type", String)
], ChannelSchema.prototype, "channelName", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.channels),
    (0, typeorm_1.JoinTable)({
        name: "channel_members",
        joinColumn: { name: "channel", referencedColumnName: "id" },
        inverseJoinColumn: { name: "user", referencedColumnName: "id" },
    }),
    __metadata("design:type", Array)
], ChannelSchema.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "admin_id", referencedColumnName: "id" }),
    __metadata("design:type", user_entity_1.User)
], ChannelSchema.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "created_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], ChannelSchema.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "updated_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], ChannelSchema.prototype, "updatedAt", void 0);
exports.ChannelSchema = ChannelSchema = __decorate([
    (0, typeorm_1.Entity)({ schema: "public" })
], ChannelSchema);
//# sourceMappingURL=channel.entity.js.map