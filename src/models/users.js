import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return this.googleId ? false : true;
    },
  },
  dateOfBirth: {
    type: String,
  },
  avatar: {
    type: String,
  },
  googleId: {
    type: String,
    required: function () {
      return this.password ? false : true;
    },
  },
});

export const User = mongoose.model("users", UserSchema);
