import { model } from "mongoose";
import { OtpSchema } from "./otpSchema.js";

const OTP = model("otp", OtpSchema);
OTP.syncIndexes();

export const saveOtp = (data) => {
  return new OTP(data).save();
};

export const deleteOtp = (filter) =>{
  return OTP.findOneAndDelete(filter);
}

export const deleteManyOtp = (filter) =>{
  return OTP.deleteMany(filter);
}

export const getOtp = (filter) =>{
  return OTP.findOne(filter);
}
