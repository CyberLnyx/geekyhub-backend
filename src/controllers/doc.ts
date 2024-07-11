import { StatusCodes } from "http-status-codes";
import { courseLevels, documentCategories } from "../constant";
import {
  sendSuccessResponse,
  throwBadRequestError,
  throwUnprocessableEntityError,
  throwUnsupportedMediaTypeError,
} from "../helpers";
import { Doc, FileContentType } from "../models";
import { courseCodeRegex, throwErrorIfBodyIsEmpty, uploadFile } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { Response } from "express";

export const uploadDocument = async (req: any, res: Response) => {
  const data = req.body;
  // const files = req.files as Express.Multer.File[];

  throwErrorIfBodyIsEmpty(data, [
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
  const newDoc = await Doc.create(data);

  return sendSuccessResponse(
    res,
    { message: "Thank you for your contribution", doc: newDoc },
    StatusCodes.CREATED
  );
};
