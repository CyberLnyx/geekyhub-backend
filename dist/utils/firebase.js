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
exports.getFileMetaData = exports.uploadImage = exports.deleteImage = void 0;
const storage_1 = require("firebase/storage");
const init_1 = require("../firebase/init"); // Adjust the path as necessary
const helpers_1 = require("../helpers");
const deleteImage = (imagePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageRef = (0, storage_1.ref)(init_1.storage, imagePath);
        yield (0, storage_1.deleteObject)(imageRef);
        console.log("Image deleted successfully");
    }
    catch (error) {
        if (typeof error === "string")
            (0, helpers_1.throwServerError)(error);
        if (error.message)
            (0, helpers_1.throwServerError)(error.message);
    }
});
exports.deleteImage = deleteImage;
const uploadImage = (uniqueId, file, bucketName) => __awaiter(void 0, void 0, void 0, function* () {
    const thumbNailRef = (0, storage_1.ref)(init_1.storage, `${bucketName}/${uniqueId}-${file.originalname}`);
    yield (0, storage_1.uploadBytes)(thumbNailRef, file.buffer, { contentType: file.mimetype });
    const fileDownloadUrl = yield (0, storage_1.getDownloadURL)(thumbNailRef);
    const fileMetaData = yield (0, storage_1.getMetadata)(thumbNailRef);
    return { fileDownloadUrl, fileMetaData };
});
exports.uploadImage = uploadImage;
const getFileMetaData = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultImageRef = (0, storage_1.ref)(init_1.storage, url);
    const metaData = yield (0, storage_1.getMetadata)(defaultImageRef);
    console.log("metadatas", metaData);
});
exports.getFileMetaData = getFileMetaData;
