import * as express from "express";
import { userRole } from "@config/constants";

declare global {
  namespace Express {
    interface Request {
      userEmail: string;
      userRole: userRole;
    }
  }
}
