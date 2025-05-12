import { Schema } from "mongoose";

const BorrowBookSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Books",
      required: true,
    },
    reviewId: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },

    dueDate: {
      type: Date,
      required: true,
    },
    isReturned: { type: Boolean, default: false },
    returnedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export { BorrowBookSchema };
