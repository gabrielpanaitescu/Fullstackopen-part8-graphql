import { Book } from "../models/book.js";

export const typeDef = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: String!
  }
`;

export const resolvers = {
  Author: {
    bookCount: async (parent, _args, { loaders }) => {
      const authorId = parent._id;

      const booksByAuthor = await loaders.bookLoader.load(authorId);

      return booksByAuthor.length;

      // const books = await Book.find({ author: { $in: [authorId] } });
      // return books.length;
    },
  },
};
