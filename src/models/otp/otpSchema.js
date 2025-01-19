import { Schema } from "mongoose";

export const OtpSchema = new Schema({
    otp: { 
        type: Number,
        required:true,
    },
    association: {
        type: String,
    },
    isExpired:{
        type: Boolean,
        default:false,
    },
    expire: {
        type: Date,
        default: new Date(Date.now() + 15*60*100), //15mins
        expires: 0,
    }
},{ timestamps: true})