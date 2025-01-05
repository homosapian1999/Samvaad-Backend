import { Router } from "express";
import { AuthController } from "./auth.controller";
import { requiresSignIn } from "../../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/register", AuthController.registerUser);
authRouter.post("/login", AuthController.loginUser);
authRouter.get("/user-info", requiresSignIn, AuthController.getUserInfo);

export { authRouter };
