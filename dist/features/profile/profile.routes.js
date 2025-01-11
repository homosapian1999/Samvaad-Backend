"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRouter = void 0;
const express_1 = require("express");
const profile_controller_1 = require("./profile.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const profileRouter = (0, express_1.Router)();
exports.profileRouter = profileRouter;
profileRouter.post("/search-contacts", authMiddleware_1.requiresSignIn, profile_controller_1.ProfileController.searchContact);
profileRouter.get("/get-dm-list", authMiddleware_1.requiresSignIn, profile_controller_1.ProfileController.getContactsForDMList);
profileRouter.get("/get-all-contacts", authMiddleware_1.requiresSignIn, profile_controller_1.ProfileController.getAllContacts);
//# sourceMappingURL=profile.routes.js.map