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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.generateOtp = void 0;
const models_1 = require("../models");
const throw_request_error_1 = require("./throw-request-error");
const generateOtp = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email }) {
    const otpCode = Math.floor(Math.random() * 900000) + 100000;
    /**
     * @deprecated
     */
    //   const expiresIn = new Date().getTime() + 300 * 1000;
    //   let otpDoc = await Otp.findOne({ email });
    //   if (otpDoc) {
    //     otpDoc.$set("otpCode", otpCode.toString());
    //     otpDoc = await otpDoc.save();
    //   } else {
    //     otpDoc = await Otp.create(newOtpDoc);
    //   }
    // const expireAt = new Date(Date.now());
    // const newOtpDoc = { email, otpCode: otpCode.toString(), expireAt };
    const newOtpDoc = { email, otpCode: otpCode.toString() };
    yield models_1.Otp.deleteMany({ email });
    const otpDoc = yield models_1.Otp.create(newOtpDoc);
    return otpDoc;
});
exports.generateOtp = generateOtp;
const verifyOTP = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, otp }) {
    if (otp.length < 6)
        (0, throw_request_error_1.throwBadRequestError)("Incorrect token length. Please provide a valid 6-character OTP");
    const token = yield models_1.Otp.findOne({ email });
    if (!token)
        return (0, throw_request_error_1.throwUnprocessableEntityError)("Invalid token or expired.");
    const { otpCode, tries } = token;
    /**
     * @deprecated Otp now disappears from database after 10mins.
     */
    //   const { expiresIn } = token;
    //   const timeDifference = expiresIn - new Date().getTime();
    //   if (timeDifference < 0) {
    //     await Otp.findOneAndDelete({ email });
    //     throwBadRequestError("Token expired. Please request a new one");
    //   }
    const otpIsValid = otp.toString() === otpCode.toString();
    if (!otpIsValid) {
        if (tries < 2) {
            yield token.$inc("tries", 1);
            yield token.save();
            (0, throw_request_error_1.throwBadRequestError)("Invalid token");
        }
        yield models_1.Otp.findOneAndDelete({ email });
        (0, throw_request_error_1.throwBadRequestError)("Invalid Token. Maximum tries exceeded. Please request a new token.");
    }
    yield models_1.Otp.findOneAndDelete({ email });
    return true;
});
exports.verifyOTP = verifyOTP;
