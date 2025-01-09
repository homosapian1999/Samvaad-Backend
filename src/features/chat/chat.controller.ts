import { Request, Response } from "express";
import { ChatService } from "./chat.service";

export class ChatController {
  public static async getMessages(req: Request, res: Response) {
    try {
      const userEmail = req.context;
      const { secondUserId }: { secondUserId: number } = req.body;
      const result = await new ChatService().getMessages(
        userEmail,
        secondUserId
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Error while getting user info " + error,
      });
    }
  }
}
