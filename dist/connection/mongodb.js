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
const mongoose_1 = require("mongoose");
const helpers_1 = require("../helpers");
const connectDB = (callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connectionString = process.env.MONGODB_URI;
        if (connectionString) {
            console.log("Connecting to the database...");
            let connection = yield (0, mongoose_1.connect)(connectionString);
            console.log("Connected to the database");
            if (callback)
                callback();
        }
        else {
            (0, helpers_1.throwServerError)("No connection string provided");
        }
    }
    catch (error) {
        console.log("An error occured during db connection");
        console.log(error.message);
        process.exit(1);
    }
});
exports.default = connectDB;
