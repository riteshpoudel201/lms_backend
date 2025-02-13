import { Schema } from "mongoose";

const BookSchema = new Schema(
  {
    status: {
      type: String,
      default:"inactive"
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug:{
      type: String,
      unique:true,
      index:1,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      trim: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    isbn: {
      type: Number,
      unique: true,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    description:{
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: false,
    },
    expectedAvailabilityDate:{
      type: Date,
      default:null,
    },
    averageRating: {
      type: Number,
    },
    addedBy: {
      name: {
        type: String,
      },
      adminId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
    lastUpdatedBy: {
      name: {
        type: String,
      },
      adminId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export { BookSchema };
