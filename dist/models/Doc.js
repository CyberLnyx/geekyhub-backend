"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const File_1 = require("./File");
const utils_1 = require("../utils");
const constant_1 = require("../constant");
const DocSchema = new mongoose_1.Schema({
    level: {
        type: String,
        uppercase: true,
        trim: true,
        required: [true, "Please provide document level"],
        enum: {
            values: constant_1.courseLevels,
            message: "Invalid document level",
        },
    },
    courseCode: {
        type: String,
        uppercase: true,
        required: [true, "Please provide document course code"],
        match: [utils_1.courseCodeRegex, "Invalid course code"],
        trim: true,
    },
    isGeneralCourse: {
        type: Boolean,
        default: false,
    },
    programme: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, "Please provide document programme"],
    },
    category: {
        type: String,
        trim: true,
        required: [true, "Please provide document category"],
        enum: {
            values: constant_1.documentCategories,
            message: "Invalid document category",
        },
    },
    documents: {
        type: [File_1.FileSchema],
        default: undefined,
        required: [true, "Please provide at least one document"],
    },
}, { timestamps: true });
const Doc = (0, mongoose_1.model)("Docs", DocSchema);
exports.default = Doc;
