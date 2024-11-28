import DataLoader from "dataloader";
import { Book } from "../models/book.js";

const bookLoader = new DataLoader(async (authorIds) => {
  const books = await Book.find({ author: { $in: authorIds } });

  const booksByAuthorId = {};

  books.forEach((book) => {
    if (booksByAuthorId[book.author] === undefined)
      booksByAuthorId[book.author] = [];
    booksByAuthorId[book.author] = booksByAuthorId[book.author].concat(book);
  });

  const booksByAuthor = authorIds.map((authorId) => {
    return booksByAuthorId[authorId];
  });

  return booksByAuthor;
});

export const loaders = {
  bookLoader,
};
