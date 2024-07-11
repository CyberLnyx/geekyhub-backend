"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.docRouter = exports.adminRouter = void 0;
const admin_1 = __importDefault(require("./admin"));
exports.adminRouter = admin_1.default;
const doc_1 = __importDefault(require("./doc"));
exports.docRouter = doc_1.default;
