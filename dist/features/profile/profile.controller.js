"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const profile_service_1 = require("./profile.service");
class ProfileController {
    static async searchContact(req, res) {
        try {
            const userEmail = req.context;
            const { searchTerm } = req.body;
            const result = await new profile_service_1.ProfileService().searchContacts(userEmail, searchTerm);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                status: false,
                message: "Error while getting user info " + error,
            });
        }
    }
    static async getContactsForDMList(req, res) {
        try {
            const userEmail = req.context;
            const result = await new profile_service_1.ProfileService().getContactsListForDM(userEmail);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                status: false,
                message: "Error while getting user info " + error,
            });
        }
    }
    static async getAllContacts(req, res) {
        try {
            const userEmail = req.context;
            const result = await new profile_service_1.ProfileService().getAllContacts(userEmail);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                status: false,
                message: "Error while getting user info " + error,
            });
        }
    }
}
exports.ProfileController = ProfileController;
//# sourceMappingURL=profile.controller.js.map