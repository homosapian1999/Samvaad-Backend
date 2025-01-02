import { Request, Response } from "express";
import { AuthService } from "./auth.service";
export class AuthController {
  public static async registerUser(req: Request, res: Response) {
    try {
      const reqBody = req.body;
      const result = await new AuthService().registerUser(reqBody);
      res.json(result).cookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600000,
      });
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
      res;
      res.json(result).cookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 259200000,
      });
    } catch (error) {
      res
        .status(400)
        .json({ status: false, message: "Error while logging in " + error });
    }
  }
}
