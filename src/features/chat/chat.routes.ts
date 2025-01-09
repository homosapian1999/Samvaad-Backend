import { Router } from "express";
import { ChatController } from "./chat.controller";
import { requiresSignIn } from "../../middlewares/authMiddleware";

const chatRouter = Router();

chatRouter.post("/get-messages", requiresSignIn, ChatController.getMessages);

export { chatRouter };
