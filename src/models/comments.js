import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
  gdl: {
    type: Schema.Types.ObjectId,
    ref: "gdl",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

export const Comment = mongoose.model("comments", CommentSchema);
