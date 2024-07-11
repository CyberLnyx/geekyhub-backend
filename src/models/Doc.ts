import { Schema, model, Model, Document } from "mongoose";
import { FileContentType, FileSchema } from "./File";
import { courseCodeRegex } from "../utils";
import { courseLevels, documentCategories } from "../constant";

export interface DocInterface extends Document {
  level: string;
  courseCode: string;
  isGeneralCourse: boolean;
  programme: string;
  category: string;
  documents: FileContentType[];
}

const DocSchema: Schema<DocInterface> = new Schema(
  {
    level: {
      type: String,
      uppercase: true,
      trim: true,
      required: [true, "Please provide document level"],
      enum: {
        values: courseLevels,
        message: "Invalid document level",
      },
    },
    courseCode: {
      type: String,
      uppercase: true,
      required: [true, "Please provide document course code"],
      match: [courseCodeRegex, "Invalid course code"],
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
        values: documentCategories,
        message: "Invalid document category",
      },
    },
    documents: {
      type: [FileSchema],
      default: undefined,
      required: [true, "Please provide at least one document"],
    },
  },
  { timestamps: true }
);

const Doc: Model<DocInterface> = model<DocInterface>("Docs", DocSchema);

export default Doc;
