import { model } from "mongoose";
import { SessionSchema } from "./sessionSchema.js";

const Session = model("Session", SessionSchema);
Session.syncIndexes();

export const createNewSession = (data) => {
  return new Session(data).save();
};

export const deleteSession = (filter) =>{
  return Session.findOneAndDelete(filter);
}
export const deleteManySession = (filter) =>{
  return Session.deleteMany(filter);
}
export const getSession = (filter) =>{
  return Session.findOne(filter);
}
