import { JwtPayload } from "jsonwebtoken";
import { User } from "../user.entity";

declare global {
  namespace Express {
    export interface Request {
      user?: User; // Add the custom user property
    }
  }
}
