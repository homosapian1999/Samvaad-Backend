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
  public static async uploadFile(req: Request, res: Response) {
    try {
      const file = req.file;
      const result = await new ChatService().uploadFile(
        file as Express.Multer.File
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Error while getting user info " + error,
      });
    }
  }
  public static async createChannel(req: Request, res: Response) {
    try {
      const userEmail = req.context;
      const { members, name }: { members: number[]; name: string } = req.body;
      const result = await new ChatService().createChannel(
        userEmail,
        members,
        name
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Error while getting user info " + error,
      });
    }
  }

  public static async getAllChannels(req: Request, res: Response) {
    try {
      const userEmail = req.context;
      const result = await new ChatService().getChannels(userEmail);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Error while getting user info " + error,
      });
    }
  }
  public static async getChannelMessages(req: Request, res: Response) {
    try {
      const channelId = parseInt(req.params.channelId, 10);
      const result = await new ChatService().getChannelChats(channelId);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Error while getting user info " + error,
      });
    }
  }
}
