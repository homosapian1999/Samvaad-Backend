"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    static async registerUser(req, res) {
        try {
            const { email, password, confirmPassword } = req.body;
            const reqBody = { email, password, confirmPassword };
            const result = await new auth_service_1.AuthService().registerUser(reqBody);
            res.cookie("token", result.token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 3600000,
            });
            res.json(result);
        }
        catch (error) {
            res
                .status(400)
                .json({ status: false, message: "Error while registering " + error });
        }
    }
    static async loginUser(req, res) {
        try {
            const reqBody = req.body;
            const result = await new auth_service_1.AuthService().loginUser(reqBody);
            res.cookie("token", result.token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 259200000,
            });
            res.json(result);
        }
        catch (error) {
            res
                .status(400)
                .json({ status: false, message: "Error while logging in " + error });
        }
    }
    static async getUserInfo(req, res) {
        try {
            const userEmail = req.context;
            const result = await new auth_service_1.AuthService().getUserInfo(userEmail);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                status: false,
                message: "Error while getting user info " + error,
            });
        }
    }
    static async updateProfile(req, res) {
        try {
            const userEmail = req.context;
            const reqBody = req.body;
            reqBody.userEmail = userEmail;
            const result = await new auth_service_1.AuthService().updateProfile(reqBody);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                status: false,
                message: "Error while getting user info " + error,
            });
        }
    }
    static async addProfileImage(req, res) {
        try {
            const userEmail = req.context;
            const file = req.file;
            const result = await new auth_service_1.AuthService().addProfileImage(userEmail, file);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                status: false,
                message: "Error while getting user info " + error,
            });
        }
    }
    static async deleteProfileImage(req, res) {
        try {
            const userEmail = req.context;
            const result = await new auth_service_1.AuthService().removeProfileImage(userEmail);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                status: false,
                message: "Error while getting user info " + error,
            });
        }
    }
    static async logout(req, res) {
        try {
            const result = await new auth_service_1.AuthService().logout();
            res.cookie("token", "", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 1,
            });
            res.json(result);
        }
        catch (error) {
            res
                .status(400)
                .json({ status: false, message: "Error while logging in " + error });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map