import { Request, Response } from "express";
import { AuthService } from "./auth.service";
export class AuthController {
  public static async registerUser(req: Request, res: Response) {
    try {
      const reqBody = req.body;
      const result = await new AuthService().registerUser(reqBody);
      res.status(200).json(result);
    } catch (error) {
      res
        .status(400)
        .json({ status: false, message: "Error while registering " + error });
    }
  }
  public static async loginUser(req: Request, res: Response) {
    try {
      const reqBody = req.body;
      const result = await new AuthService().loginUser(reqBody);
      res.status(200).json(result);
    } catch (error) {
      res
        .status(400)
        .json({ status: false, message: "Error while logging in " + error });
    }
  }
}
