import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export function authMiddleware(req: Request, res: Response, next: NextFunction): any {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No Authorization Header found!" });
  }

  const token = authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "No token found!" });
  }


  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;

    
    req.userId = decodedToken.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token!" });
  }
}
