import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const requiresSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = user;
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
