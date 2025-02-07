"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doc = exports.Admin = exports.Otp = void 0;
const Otp_1 = __importDefault(require("./Otp"));
exports.Otp = Otp_1.default;
const Admin_1 = __importDefault(require("./Admin"));
exports.Admin = Admin_1.default;
const Doc_1 = __importDefault(require("./Doc"));
exports.Doc = Doc_1.default;
__exportStar(require("./Otp"), exports);
__exportStar(require("./File"), exports);
__exportStar(require("./Admin"), exports);
__exportStar(require("./Doc"), exports);
