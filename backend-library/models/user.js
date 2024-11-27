import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  passwordHash: String,
  favoriteGenre: {
    type: String,
    min: 1,
  },
});

export const User = model("User", userSchema);
