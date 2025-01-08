import { model } from "mongoose";
import { UserSchema } from "./userSchema.js";

const User = model("User", UserSchema);

export const getUser = () => {
  return User.find();
};

export const createNewUser = (data) => {
  return User(data).save();
};

export const updateUser = (filter, update) => {
  return User.findOneAndUpdate(filter, update, { new: true });
};

export const getUserByEmail =(email) => {
  return User. findOne({email});
}