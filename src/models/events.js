import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema({
  gdl: {
    type: Schema.Types.ObjectId,
    ref: "gdl",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

export const Event = mongoose.model("events", EventSchema);
