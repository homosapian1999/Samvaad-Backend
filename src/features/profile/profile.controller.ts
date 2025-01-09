import { ProfileService } from "./profile.service";
import { Request, Response } from "express";

export class ProfileController {
  public static async searchContact(req: Request, res: Response) {
    try {
      const userEmail = req.context;
      const { searchTerm }: { searchTerm: string } = req.body;
      const result = await new ProfileService().searchContacts(
        userEmail,
        searchTerm
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Error while getting user info " + error,
      });
    }
  }
  public static async getContactsForDMList(req: Request, res: Response) {
    try {
      const userEmail = req.context;
      const result = await new ProfileService().getContactsListForDM(userEmail);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Error while getting user info " + error,
      });
    }
  }
}
