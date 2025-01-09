import { Router } from "express";
import { ProfileController } from "./profile.controller";
import { requiresSignIn } from "../../middlewares/authMiddleware";

const profileRouter = Router();

profileRouter.post(
  "/search-contacts",
  requiresSignIn,
  ProfileController.searchContact
);

profileRouter.get(
  "/get-dm-list",
  requiresSignIn,
  ProfileController.getContactsForDMList
);

export { profileRouter };
