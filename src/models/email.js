import mongoose, { Schema } from "mongoose";

const EmailSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export const Email = mongoose.model("email", EmailSchema);
