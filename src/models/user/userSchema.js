import mongoose from "mongoose";

export const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    phone:{
        type:String,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    isActivated:{
        type: Boolean,
        default: false,
    },
    refreshJwt:{
        type: String,
    }
  },
  { timestamps: true }
);
