import { Router } from "express";
import { AuthController } from "./auth.controller";
import { requiresSignIn } from "../../middlewares/authMiddleware";
import multer from "multer";

const authRouter = Router();
const upload = multer({ dest: "uploads/profiles" });

authRouter.post("/register", AuthController.registerUser);
authRouter.post("/login", AuthController.loginUser);
authRouter.get("/user-info", requiresSignIn, AuthController.getUserInfo);
authRouter.post(
  "/update-profile",
  requiresSignIn,
  AuthController.updateProfile
);

authRouter.post(
  "/add-profile-image",
  requiresSignIn,
  upload.single("profile-image"),
  AuthController.addProfileImage
);

authRouter.delete(
  "/remove-profile-image",
  requiresSignIn,
  AuthController.deleteProfileImage
);

authRouter.post("/logout", requiresSignIn, AuthController.logout);

export { authRouter };
