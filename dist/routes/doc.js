"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const helpers_1 = require("../helpers");
const controllers_1 = require("../controllers");
// create an instance of a router
const docRouter = (0, helpers_1.routerCreator)();
// create a parser than can parse form-data
const upload = (0, multer_1.default)();
// docRouter.post("/upload", upload.array("documents"), uploadDocument);
docRouter.post("/upload", controllers_1.uploadDocument);
exports.default = docRouter;
