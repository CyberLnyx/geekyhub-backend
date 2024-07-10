"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSchema = void 0;
const mongoose_1 = require("mongoose");
exports.FileSchema = new mongoose_1.Schema({
    downloadUrl: {
        type: String,
        required: [true, "Please provide file download url"],
        trim: true,
    },
    metadata: {
        name: {
            type: String,
            required: [true, "Please provide file name"],
            trim: true,
        },
        size: {
            type: Number,
            required: [true, "Please provide file size"],
        },
        fullPath: {
            type: String,
            required: [true, "Please provide file full path"],
            trim: true,
        },
        timeCreated: {
            type: Date,
            required: [true, "Please provide file created time"],
            trim: true,
        },
    },
}, { timestamps: true });
