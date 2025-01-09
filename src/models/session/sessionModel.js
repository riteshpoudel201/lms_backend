import { model } from "mongoose";
import { SessionSchema } from "./sessionSchema.js";

const Session = model("Session", SessionSchema);

export const createNewSession = (data) => {
  return new Session(data).save();
};

export const deleteSession = (filter) =>{
  return Session.findOneAndDelete(filter);
}
export const getSession = (filter) =>{
  return Session.findOne(filter);
}
