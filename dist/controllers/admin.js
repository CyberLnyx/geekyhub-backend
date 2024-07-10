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
exports.logout = exports.verifyAccount = exports.requestAccountVerificationOTP = exports.removeAdminAccount = exports.getAdminDetails = exports.login = exports.register = void 0;
const models_1 = require("../models");
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = __importDefault(require("lodash"));
const helpers_1 = require("../helpers");
const utils_1 = require("../utils");
const register = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        (0, utils_1.throwErrorIfBodyIsEmpty)(data, ["email", "password"], "Please provide all fields");
        const newAdmin = yield models_1.Admin.create(data);
        const userWithoutPassword = lodash_1.default.omit(newAdmin.toObject(), "password");
        userWithoutPassword.userId = userWithoutPassword._id;
        const { userId, email } = userWithoutPassword;
        const accessToken = newAdmin.generateToken({ userId, email });
        return (0, helpers_1.sendSuccessResponse)(res, {
            message: "Admin account created successfully",
            user: userWithoutPassword,
            accessToken,
        }, http_status_codes_1.StatusCodes.CREATED);
    });
};
exports.register = register;
const login = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        (0, utils_1.throwErrorIfBodyIsEmpty)(data, ["email", "password"], "Email and Password required");
        const user = yield models_1.Admin.findOne({ email: data.email });
        if (!user)
            return (0, helpers_1.throwUnauthorizedError)("Invalid Email or Password");
        if (user.loginAttempts >= 3)
            (0, helpers_1.throwUnprocessableEntityError)("Maximum login attempt exceeded. Your account has been locked. Please contact admin @(philipowolabi79@gmail.com) for fixing");
        // Validate the password using the document method (validatePassword)
        const isValidPassword = yield user.validatePassword(data.password);
        if (!isValidPassword) {
            user.$inc("loginAttempts", 1);
            user.set("isLoggedIn", false);
            yield user.save();
            (0, helpers_1.throwUnauthorizedError)("Invalid Email or Password");
        }
        // Generate jwt for valid email and password
        user.set("isLoggedIn", true);
        user.set("loginAttempts", 0);
        yield user.save();
        const userWithoutPassword = lodash_1.default.omit(user.toObject(), "password");
        userWithoutPassword.userId = userWithoutPassword._id;
        const { userId, email } = userWithoutPassword;
        const accessToken = user.generateToken({ userId, email });
        return (0, helpers_1.sendSuccessResponse)(res, {
            message: "Login successful",
            user: userWithoutPassword,
            accessToken,
        });
    });
};
exports.login = login;
const getAdminDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userWithoutPassword = lodash_1.default.omit(req.currentUser.toObject(), "password");
    userWithoutPassword.userId = userWithoutPassword._id;
    return (0, helpers_1.sendSuccessResponse)(res, {
        message: "Successful",
        user: userWithoutPassword,
    });
});
exports.getAdminDetails = getAdminDetails;
const removeAdminAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.throwErrorIfBodyIsEmpty)(req.body, undefined, "Please provide req body");
    const { userId, email } = req.body;
    if (!userId && !email)
        (0, helpers_1.throwBadRequestError)("PLease provide user id or email");
    let finder = {};
    if (userId) {
        finder._id = userId;
    }
    if (email) {
        finder.email = email;
    }
    let user = yield models_1.Admin.findOneAndDelete(finder).select("-password");
    if (!user)
        return (0, helpers_1.throwNotFoundError)("Admin not found.");
    const userWithoutPassword = lodash_1.default.omit(user.toObject());
    userWithoutPassword.userId = userWithoutPassword._id;
    return (0, helpers_1.sendSuccessResponse)(res, {
        message: "Admin account removed successfully.",
        user: userWithoutPassword,
    });
});
exports.removeAdminAccount = removeAdminAccount;
const requestAccountVerificationOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.currentUser;
    if (req.currentUser.isVerified)
        (0, helpers_1.throwUnprocessableEntityError)("Account already verified");
    const user = yield models_1.Admin.findOne({
        email: { $regex: email, $options: "i" },
    });
    if (!user)
        return (0, helpers_1.throwUnauthorizedError)("Unauthorized User");
    const otpDoc = (yield (0, helpers_1.generateOtp)({ email }));
    const mailOptions = {
        content: {
            otpCode: Number(otpDoc.otpCode),
            email: otpDoc.email,
        },
        template: "verification",
    };
    yield (0, helpers_1.sendOtpEmail)(mailOptions);
    return (0, helpers_1.sendSuccessResponse)(res, {
        message: "A verification code has been sent to your email.",
    });
});
exports.requestAccountVerificationOTP = requestAccountVerificationOTP;
const verifyAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.currentUser;
    if (!email)
        return (0, helpers_1.throwUnauthorizedError)("Unauthorized user");
    const { otp } = req.body;
    if (!otp)
        return (0, helpers_1.throwBadRequestError)("Must provide verification code");
    yield (0, helpers_1.verifyOTP)({ email, otp });
    yield req.currentUser.set("isVerified", true);
    yield req.currentUser.save();
    return (0, helpers_1.sendSuccessResponse)(res, {
        message: "Verification successful",
        redirectUrl: "/dashboard",
    });
});
exports.verifyAccount = verifyAccount;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: userId, email } = req.currentUser;
    let finder = {};
    if (userId) {
        finder._id = userId;
    }
    if (email) {
        finder.email = email;
    }
    let user = yield models_1.Admin.findOneAndUpdate(finder, {
        isLoggedIn: false,
        loginAttempts: 0,
    }, { new: true }).select("-password");
    if (!user)
        return (0, helpers_1.throwUnauthorizedError)("Unauthorized User");
    const userWithoutPassword = lodash_1.default.omit(user.toObject());
    userWithoutPassword.userId = userWithoutPassword._id;
    return (0, helpers_1.sendSuccessResponse)(res, {
        message: "Logout successful",
        user: userWithoutPassword,
    });
});
exports.logout = logout;
