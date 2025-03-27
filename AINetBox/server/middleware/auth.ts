
import { type Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Check if user is authenticated
  const userId = req.headers["x-replit-user-id"];
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}
