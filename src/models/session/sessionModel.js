import { model } from "mongoose";
import { SessionSchema } from "./sessionSchema.js";

const Session = model("Session", SessionSchema);

export const createNewSession = (data) => {
  return new Session(data).save();
};
