import mongoose, { Schema } from "mongoose";

const GdlSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  bookTitle: {
    type: String,
    required: true,
  },
  bookAuthor: {
    type: String,
    required: true,
  },
  readTime: {
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: "hours",
    },
  },
  pages: {
    type: Number,
    required: true,
  },
  deadline: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
  },
});

export const GDL = mongoose.model("gdl", GdlSchema);
