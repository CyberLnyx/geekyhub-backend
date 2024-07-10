import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebase/init"; // Adjust the path as necessary
import { throwServerError } from "../helpers";

export const deleteImage = async (imagePath: string) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    console.log("Image deleted successfully");
  } catch (error: any) {
    if (typeof error === "string") throwServerError(error);
    if (error.message) throwServerError(error.message);
  }
};

export const uploadImage = async (
  uniqueId: string,
  file: any,
  bucketName: string
) => {
  const thumbNailRef = ref(
    storage,
    `${bucketName}/${uniqueId}-${file.originalname}`
  );
  await uploadBytes(thumbNailRef, file.buffer, { contentType: file.mimetype });
  const fileDownloadUrl = await getDownloadURL(thumbNailRef);
  const fileMetaData = await getMetadata(thumbNailRef);
  return { fileDownloadUrl, fileMetaData };
};

export const getFileMetaData = async (url: string) => {
  const defaultImageRef = ref(storage, url);
  const metaData = await getMetadata(defaultImageRef);
  console.log("metadatas", metaData);
};
