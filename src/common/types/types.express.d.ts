import * as express from "express";
import { roleName } from "@config/constants";

declare global {
  namespace Express {
    interface Request {
      userEmail: string;
      userRole: roleName;
    }
  }
}
