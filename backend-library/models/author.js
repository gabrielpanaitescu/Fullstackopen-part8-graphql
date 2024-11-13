import { model, Schema } from "mongoose";

const authorSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  born: {
    type: Number,
    min: 1,
  },
});

export const Author = model("Author", authorSchema);
