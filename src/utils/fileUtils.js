import { unlink } from "fs";
import { resolve } from "path";

export const deleteFile = async (path) => {
  try {
    const fullPath = resolve("public",path);
    await unlink(fullPath,(err)=> console.log("Error: ", err));
    console.log(`File deleted successfully: ${fullPath}`);
  } catch (error) {
    console.error(`Error deleting file at ${path}:`, error);
  }
}
export const deleteUploadedFiles = (req) => {
  if (req.file) {
    deleteFile(req.file.path);
    return;
  }

  if (req.files) {
    req.files.map((file) => deleteFile(file.path));
    return;
  }
};
