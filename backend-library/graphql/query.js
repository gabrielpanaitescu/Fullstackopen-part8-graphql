import { Book } from "../models/book.js";
import { Author } from "../models/author.js";
import { GraphQLError } from "graphql";

export const typeDef = `
  type Query {
    authorCount: String!
    bookCount: String!
    allBooks(author: String, genres: [String!]): [Book!]!
    allAuthors: [Author!]!
    getAuthor(name: String!): Author
    me: User
    genreList: [String!]!
}`;

export const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (_, { author, genres }) => {
      if (author && genres) {
        return Book.aggregate([
          {
            $match: { genres: { $all: genres } },
          },
          {
            $lookup: {
              from: "authors",
              localField: "author",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $unwind: "$author",
          },
          {
            $match: { "author.name": author },
          },
        ]);
      } else if (genres) {
        return Book.find({ genres: { $all: genres } }).populate("author");
      } else if (author) {
        return Book.aggregate([
          {
            $lookup: {
              from: "authors",
              localField: "author",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $unwind: "$author",
          },
          {
            $match: { "author.name": author },
          },
        ]);
      } else {
        // const books = await Book.find({});

        // const authors = await Author.find({
        //   _id: { $in: books.map((book) => book.author) },
        // });

        // const authorsById = {};

        // authors.forEach((author) => {
        //   authorsById[author.id] = author;
        // });

        // console.log("authorsById", authorsById);

        // const booksWithAuthorPopulated = books.map((book) => {
        //   console.log("book.author", book.author.toString());

        //   return {
        //     ...book._doc,
        //     author: authorsById[book.author.toString()],
        //   };
        // });

        // return booksWithAuthorPopulated;

        return Book.find({}).populate("author");
      }
    },
    allAuthors: async () => Author.find({}),
    getAuthor: async (_, { name }) => Author.findOne({ name }),
    me: (_, __, { currentUser }) => {
      return currentUser;
    },
    genreList: async () => {
      const genres = await Book.aggregate([
        { $unwind: "$genres" },
        { $group: { _id: null, noDuplicates: { $addToSet: "$genres" } } },
        { $project: { _id: 0, noDuplicates: 1 } },
      ]);

      if (genres.length < 1) return genres;

      return genres[0].noDuplicates.sort((a, b) => {
        if (a.toLowerCase() > b.toLowerCase()) {
          return 1;
        } else {
          return -1;
        }
      });
    },
  },
};
