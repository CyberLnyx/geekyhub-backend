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
exports.uploadDocument = void 0;
const http_status_codes_1 = require("http-status-codes");
const helpers_1 = require("../helpers");
const models_1 = require("../models");
const utils_1 = require("../utils");
const uploadDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    // const files = req.files as Express.Multer.File[];
    (0, utils_1.throwErrorIfBodyIsEmpty)(data, [
        "level",
        "courseCode",
        "isGeneralCourse",
        "programme",
        "category",
        "documents",
    ]);
    // Check if there are files and if they all images
    // const isDocumentProvided = req.files && req.files.length > 0;
    // if (!isDocumentProvided)
    //   return throwBadRequestError("Please provide document(s)");
    // const isAllValidDocs = Object.values(req.files).every(
    //   (file: any) => file.fieldname === "documents"
    // );
    // if (!isAllValidDocs)
    //   return throwUnsupportedMediaTypeError("Please provide valid document");
    // const { level, courseCode, isGeneralCourse, programme, category } = data;
    // if (!courseLevels.includes(level.toUpperCase()))
    //   return throwUnprocessableEntityError("Invalid level");
    // if (!courseCodeRegex.test(courseCode))
    //   return throwUnsupportedMediaTypeError("Invalid course code");
    // if (!documentCategories.includes(category))
    //   return throwUnprocessableEntityError("Invalid document category");
    // Upload documents
    // let uploadDocPromises: Promise<any>[] = [];
    // let docs: FileContentType[] = [];
    // files.forEach((file) => {
    //   let uploadPromise = new Promise(async (resolve) => {
    //     const generatedImageName = uuidv4();
    //     const { fileDownloadUrl, fileMetaData } = await uploadFile(
    //       generatedImageName,
    //       file,
    //       category.toLowerCase().split(" ").join("-")
    //     );
    //     docs.push({
    //       downloadUrl: fileDownloadUrl,
    //       metadata: {
    //         fullPath: fileMetaData.fullPath,
    //         name: fileMetaData.name,
    //         size: fileMetaData.size,
    //         timeCreated: fileMetaData.timeCreated,
    //       },
    //     });
    //     resolve(null);
    //   });
    //   uploadDocPromises.push(uploadPromise);
    // });
    // await Promise.all(uploadDocPromises);
    // const newDoc = await Doc.create({
    //   ...data,
    //   documents: docs,
    // });
    const newDoc = yield models_1.Doc.create(data);
    return (0, helpers_1.sendSuccessResponse)(res, { message: "Thank you for your contribution", doc: newDoc }, http_status_codes_1.StatusCodes.CREATED);
});
exports.uploadDocument = uploadDocument;
