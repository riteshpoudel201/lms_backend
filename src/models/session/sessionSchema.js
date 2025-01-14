import { Schema } from "mongoose";

export const SessionSchema = new Schema({
    token: { 
        type: String,
        required:true,
    },
    association: {
        type: String,
    },
    expire: {
        type: Date,
        default: new Date(Date.now() + 3600000), //1hr
        expires: 0,
    }
},{ timestamps: true})