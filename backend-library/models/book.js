import { Schema, model } from "mongoose";

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  published: {
    type: Number,
    required: true,
  },
  genres: [
    {
      type: String,
      required: true,
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
  },
});

export const Book = model("Book", bookSchema);
