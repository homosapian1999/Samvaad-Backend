import { Router } from "express";
import { ChatController } from "./chat.controller";
import { requiresSignIn } from "../../middlewares/authMiddleware";
import multer from "multer";

const chatRouter = Router();
const upload = multer();

chatRouter.post("/get-messages", requiresSignIn, ChatController.getMessages);
chatRouter.post(
  "/upload-file",
  requiresSignIn,
  upload.single("file"),
  ChatController.uploadFile
);
chatRouter.post(
  "/create-channel",
  requiresSignIn,
  ChatController.createChannel
);

chatRouter.get("/get-channels", requiresSignIn, ChatController.getAllChannels);
chatRouter.get(
  "/get-channel-messages/:channelId",
  requiresSignIn,
  ChatController.getChannelMessages
);

export { chatRouter };
