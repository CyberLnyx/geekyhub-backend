"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const mongoose_1 = require("mongoose");
const ResetOTPSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "Must provide current email"],
        trim: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ],
    },
    otpCode: {
        type: String,
        required: [true, "Must provide otp code"],
    },
    /**
     * @deprecated Otp now disappear from database after 10 mins
     */
    // expiresIn: {
    //   type: Number,
    //   required: [true, "Must provide expiration date"],
    // },
    tries: {
        type: Number,
        default: 0,
    },
    // expireAt: { type: Date, expires: 600 },
    createdAt: { type: Date, expires: "9m", default: Date.now },
}, { timestamps: true });
exports.Otp = (0, mongoose_1.model)("Otps", ResetOTPSchema);
exports.default = exports.Otp;
