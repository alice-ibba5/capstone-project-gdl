import mongoose, { Schema } from "mongoose";

const GdSeriesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  booksId: {
    type: [Schema.Types.ObjectId],
    ref: "gdl",
    required: true,
  },
  readTime: {
    value: {
      type: Number,
    },
    unit: {
      type: String,
      default: "hours",
    },
  },
  pages: {
    type: Number,
  },
  deadline: {
    type: String,
  },
  cover: {
    type: String,
  },
  userId: {
    type: [Schema.Types.ObjectId],
    ref: "users",
  },
});

export const GDSeries = mongoose.model("gdSeries", GdSeriesSchema);
