import { Schema } from "mongoose";

const BookSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
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
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: false,
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
    updatedBy: {
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
