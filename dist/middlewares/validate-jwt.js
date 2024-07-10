"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const helpers_1 = require("../helpers");
// This middleware is used to validate the token on incoming request
const validateToken = (tokenType = "admin") => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    // Ensure the authorization property is present in req headers
    if (!authHeader || !authHeader.startsWith("Bearer "))
        return (0, helpers_1.throwUnauthorizedError)("Token not provided");
    // Extract the token from the authorization header
    const token = authHeader.split(" ")[1];
    // Verify the token with jwt
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret)
        return (0, helpers_1.throwServerError)("Missing JWT SECRET in server environment");
    const issuer = process.env.ISSUER;
    if (!issuer)
        return (0, helpers_1.throwServerError)("Missing JWT ISSUER in server environment");
    let valid = jsonwebtoken_1.default.verify(token, jwtSecret, {
        issuer,
    });
    if (!valid)
        return (0, helpers_1.throwUnauthorizedError)("Malformed Token");
    // Pick the userId and email from the decoded token
    const { userId, email } = valid;
    // Check if user with such credential exists in the database
    let currentUser;
    if (tokenType === "admin") {
        currentUser = yield models_1.Admin.findOne({ _id: userId, email });
    }
    if (!currentUser)
        return (0, helpers_1.throwUnauthorizedError)("Admin not authorized");
    if (tokenType === "admin" && !currentUser.isLoggedIn)
        return (0, helpers_1.throwUnauthorizedError)("Unauthorized. Please login and try again");
    req.currentUser = currentUser;
    next();
});
exports.default = validateToken;
