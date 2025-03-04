import { unlink } from "fs";
import {resolve } from "path";

const deleteFile = (path) =>{
    try{ console.log("File unlinked.");
        unlink(resolve(path),()=>{})

    } catch(error){
        console.log("Error from fileUtil.js ", error);
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
