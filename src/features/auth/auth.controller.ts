import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { UpdateProfile } from "./auth.types";
export class AuthController {
  public static async registerUser(req: Request, res: Response) {
    try {
      const { email, password, confirmPassword } = req.body;
      const reqBody = { email, password, confirmPassword };
      const result = await new AuthService().registerUser(reqBody);
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600000,
      });
      res.json(result);
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
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 259200000,
      });
      res.json(result);
    } catch (error) {
      res
        .status(400)
        .json({ status: false, message: "Error while logging in " + error });
    }
  }
  public static async getUserInfo(req: Request, res: Response) {
    try {
      const userEmail = req.context;
      const result = await new AuthService().getUserInfo(userEmail);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Error while getting user info " + error,
      });
    }
  }
  public static async updateProfile(req: Request, res: Response) {
    try {
      const userEmail = req.context;
      const reqBody: UpdateProfile = req.body;
      reqBody.userEmail = userEmail;
      const result = await new AuthService().updateProfile(reqBody);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Error while getting user info " + error,
      });
    }
  }
  public static async addProfileImage(req: Request, res: Response) {
    try {
      const userEmail = req.context;
      const file = req.file;
      const result = await new AuthService().addProfileImage(
        userEmail,
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
  public static async deleteProfileImage(req: Request, res: Response) {
    try {
      const userEmail = req.context;
      const result = await new AuthService().removeProfileImage(userEmail);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Error while getting user info " + error,
      });
    }
  }
  public static async logout(req: Request, res: Response) {
    try {
      const result = await new AuthService().logout();
      res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1,
      });
      res.json(result);
    } catch (error) {
      res
        .status(400)
        .json({ status: false, message: "Error while logging in " + error });
    }
  }
}
