import jwt from "jsonwebtoken";
import { Admin } from "../models";
import { NextFunction, Request, Response } from "express";
import { throwServerError, throwUnauthorizedError } from "../helpers";

export interface ExtendedRequest extends Request {
  [key: string]: any;
}

export interface EncodedParams {
  userId: string;
  email: string;
}

// This middleware is used to validate the token on incoming request
const validateToken =
  (tokenType: string = "admin") =>
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    // Ensure the authorization property is present in req headers
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return throwUnauthorizedError("Token not provided");
    // Extract the token from the authorization header
    const token = authHeader.split(" ")[1];
    // Verify the token with jwt
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret)
      return throwServerError("Missing JWT SECRET in server environment");
    const issuer = process.env.ISSUER;
    if (!issuer)
      return throwServerError("Missing JWT ISSUER in server environment");
    let valid = jwt.verify(token, jwtSecret, {
      issuer,
    }) as EncodedParams;
    if (!valid) return throwUnauthorizedError("Malformed Token");
    // Pick the userId and email from the decoded token
    const { userId, email } = valid;
    // Check if user with such credential exists in the database
    let currentUser;
    if (tokenType === "admin") {
      currentUser = await Admin.findOne({ _id: userId, email });
    }
    if (!currentUser)
      return throwUnauthorizedError("Admin not authorized") as any;
    if (tokenType === "admin" && !currentUser.isLoggedIn)
      return throwUnauthorizedError("Unauthorized. Please login and try again");
    req.currentUser = currentUser;
    next();
  };

export default validateToken;
