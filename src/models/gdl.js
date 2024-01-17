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
  bookPlot: {
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
  userId: {
    type: [Schema.Types.ObjectId],
    ref: "users",
  },
});

export const GDL = mongoose.model("gdl", GdlSchema);

/*
{
  "user": "659ed8a5475f60c3f58d73ae",
  "category": "Historical Fiction",
  "bookTitle": "Memorie di una geisha",
  "bookAuthor": "Arthur Golden",
  "readTime": {
    "value": 24,
    "unit": "hours"
  },
  "pages": 574,
  "deadline": "31/03/2024"
}
*/
