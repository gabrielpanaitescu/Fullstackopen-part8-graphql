import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";
import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import { MONGODB_URI, PORT } from "./utils/config.js";
import { Book } from "./models/book.js";
import { Author } from "./models/author.js";
import { User } from "./models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

mongoose.set("strictQuery", false);

mongoose.connect(MONGODB_URI).then(() => console.log("Connected to MongoDB"));

const typeDefs = `
  type User {
    username: String!,
    id: ID!
  }

  type Token {  
    value: String!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: String!
  } 
    
    type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    authorCount: String!
    bookCount: String!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    getAuthor(name: String!): Author
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    updateAuthor(name: String!, year: Int!): Author
    createUser(username: String!, password: String!): User
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (_, { author, genre }) => {
      const books = await Book.find({}).populate("author");

      if (author && genre) {
        return books.filter(
          (book) => book.author.name === author && book.genres.includes(genre)
        );
      } else if (genre) {
        return books.filter((book) => book.genres.includes(genre));
      } else if (author) {
        return books.filter((book) => book.author.name === author);
      }

      return books;
    },
    allAuthors: async () => Author.find({}),
    getAuthor: async (_, { name }) => Author.findOne({ name }),
    me: (_, __, { currentUser }) => currentUser,
  },
  Mutation: {
    addBook: async (_, { author, ...args }, { currentUser }) => {
      if (!currentUser)
        throw new GraphQLError("Wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      const storedAuthor = await Author.findOne({ name: author });

      let newBook;

      if (!storedAuthor) {
        const newAuthor = new Author({ name: author });

        try {
          await newAuthor.save();
        } catch (error) {
          throw new GraphQLError("Could not save the new author", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: author,
              error,
            },
          });
        }

        newBook = new Book({ ...args, author: newAuthor._id });
      } else {
        newBook = new Book({ ...args, author: storedAuthor._id });
      }

      try {
        await newBook.save();
      } catch (error) {
        throw new GraphQLError("Could not add the new book", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }

      return newBook.populate("author");
    },
    updateAuthor: async (_, { name, year }, { currentUser }) => {
      if (!currentUser)
        throw new GraphQLError("Wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      let updatedAuthor;
      try {
        updatedAuthor = await Author.findOneAndUpdate(
          { name },
          { born: year },
          { runValidators: true, new: true }
        );
      } catch (error) {
        throw new GraphQLError("Could not update author", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: year,
            error,
          },
        });
      }

      if (!updatedAuthor)
        throw new GraphQLError("Could not find author with given name", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: name,
          },
        });

      return updatedAuthor;
    },
    createUser: async (_, { username, password }) => {
      if (
        !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          password
        )
      )
        throw new GraphQLError("Bad format password", {
          extensions: {
            code: "BAD_USER_INPUT",
            message:
              "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.",
          },
        });

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const newUser = new User({
        username,
        passwordHash,
      });

      try {
        await newUser.save();
      } catch (error) {
        throw new GraphQLError("Could not create new user", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }

      return newUser;
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });

      const passwordCorrect =
        user === null
          ? null
          : await bcrypt.compare(password, user.passwordHash);

      if (!passwordCorrect)
        throw new GraphQLError("Could not login", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      const token = jwt.sign(userForToken, process.env.JWT_SECRET);

      return {
        value: token,
      };
    },
  },
  Author: {
    bookCount: async (parent) => {
      const books = await Book.find({});
      return books.filter(
        (book) => book.author.toString() === parent._id.toString()
      ).length;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: async ({ req }) => {
    const authHeader = req ? req.headers.authorization : null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const currentUser = await User.findById(decodedToken.id);

      return { currentUser };
    }
  },
});
console.log(`Server running at ${url}`);
