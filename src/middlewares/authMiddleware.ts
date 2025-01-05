import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "src/entity/user.entity";

dotenv.config();

export const requiresSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET!) as {
        email: string;
      };
      req.context = user.email;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res
      .status(401)
      .json({ message: "You must be signed in to access this resource" });
  }
};
