"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        return hashedPassword;
    }
    catch (error) {
        throw error;
    }
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt_1.default.compare(password, hashedPassword);
        return isMatch;
    }
    catch (error) {
        throw error;
    }
};
exports.comparePassword = comparePassword;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
//# sourceMappingURL=authHelper.js.map