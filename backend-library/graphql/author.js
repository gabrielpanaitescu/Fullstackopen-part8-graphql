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
    // bookCount: async (parent) => {
    //   const books = await Book.find({});
    //   return books.filter(
    //     (book) => book.author.toString() === parent._id.toString()
    //   ).length;
    // },
  },
};
