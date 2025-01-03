import mongoose from "mongoose";
import { UserSchema } from "./userSchema.js";

const User = mongoose.model("User", UserSchema);

export const getUser = () =>{
    return User.find();
}

export const createNewUser = (data) =>{
    return User(data).save();
}
