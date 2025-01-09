import { Router } from "express";
import { ChatController } from "./chat.controller";
import { requiresSignIn } from "../../middlewares/authMiddleware";
import multer from "multer";

const chatRouter = Router();
const upload = multer({ dest: "/uploads/files" });

chatRouter.post("/get-messages", requiresSignIn, ChatController.getMessages);
chatRouter.post(
  "/upload-file",
  requiresSignIn,
  upload.single("file"),
  ChatController.uploadFile
);

export { chatRouter };
