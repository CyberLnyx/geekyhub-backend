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
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils");
const AdminSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [utils_1.adminEmailRegex, "Invalid email"],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide Password"],
        match: [
            utils_1.validPasswordRegex,
            "Password must contain at least one uppercase letter, one lowercase letter, a number and special character",
        ],
        trim: true,
        minLength: [
            8,
            "The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH}).",
        ],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isLoggedIn: {
        type: Boolean,
        default: true,
    },
    loginAttempts: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
// Setup bcrypt for password encryption
AdminSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            return next();
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    });
});
// Setup password validation
AdminSchema.methods.validatePassword = function (inputPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(inputPassword, this.password);
    });
};
// Setup token generation
AdminSchema.methods.generateToken = function ({ userId, email }) {
    let token = jsonwebtoken_1.default.sign({ userId, email }, process.env.JWT_SECRET, {
        issuer: process.env.ISSUER,
        expiresIn: process.env.JWT_EXPIRATION,
    });
    return token;
};
const Admin = (0, mongoose_1.model)("Admins", AdminSchema);
exports.default = Admin;
