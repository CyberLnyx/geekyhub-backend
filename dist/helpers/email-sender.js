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
exports.sendOrderEmail = exports.sendOtpEmail = exports.sendContactEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
const CustomError_1 = __importDefault(require("../errors/CustomError"));
const path_1 = __importDefault(require("path"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
(0, dotenv_1.config)();
let transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    // service: "gmail",
    port: 587,
    // secure: true,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.SMTPPASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
let options = {
    viewEngine: {
        extName: ".hbs",
        partialsDir: path_1.default.resolve("./src/views"),
        defaultLayout: false,
    },
    viewPath: path_1.default.resolve("./src/views"),
    extName: ".hbs",
};
transporter.use("compile", (0, nodemailer_express_handlebars_1.default)(options));
const sendEmail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                reject(new CustomError_1.default("Error occured. Please try again"));
            }
            else {
                console.log("Email sent: " + info.response);
                // return true;
                resolve(info.response);
            }
        });
    });
});
exports.sendEmail = sendEmail;
const sendContactEmail = (data) => {
    let mailOptions = {
        // from: process.env.EMAIL,
        from: `${data.fullName} <${data.email}>`,
        // to: "Pave05@gmail.com",
        to: "philipowolabi79@gmail.com",
        // subject: "New Contact",
        subject: "Someone just reached out to you.",
        template: "contact",
        context: {
            body: data,
        },
    };
    return (0, exports.sendEmail)(mailOptions);
};
exports.sendContactEmail = sendContactEmail;
const sendOtpEmail = (data) => {
    let mailOptions = {
        from: "Philip from Student Week",
        to: data.content.email,
        subject: "Account Verification",
        template: data.template,
        context: { body: data.content },
    };
    return (0, exports.sendEmail)(mailOptions);
};
exports.sendOtpEmail = sendOtpEmail;
const sendOrderEmail = (data) => {
    let mailOptions = {
        from: "Philip from Pave",
        to: data.email,
        subject: "Order Confirmation",
        template: "order",
        context: { body: data.content },
    };
    return (0, exports.sendEmail)(mailOptions);
};
exports.sendOrderEmail = sendOrderEmail;
exports.default = exports.sendEmail;
