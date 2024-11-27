import { Book } from "../models/book.js";
import { Author } from "../models/author.js";
import { User } from "../models/user.js";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pubsub } from "../index.js";

export const typeDef = `
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    updateAuthor(name: String!, year: Int!): Author
    createUser(username: String!, password: String!): User
    login(username: String!, password: String!): Token
    setFavoriteGenre(genre: String!): User
}`;

export const resolvers = {
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
        const newAuthor = new Author({ name: author, bookCount: 1 });

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
      } else if (storedAuthor) {
        storedAuthor.bookCount += 1;

        try {
          await storedAuthor.save();
        } catch (error) {
          throw new GraphQLError(
            "Could not increment book count of saved author",
            {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: args.title,
                error,
              },
            }
          );
        }

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

      pubsub.publish("BOOK_ADDED", { bookAdded: newBook.populate("author") });

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
        throw new GraphQLError("Bad username or password", {
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
    setFavoriteGenre: async (_, { genre }, { currentUser }) => {
      if (!currentUser)
        throw new GraphQLError("Wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      currentUser.favoriteGenre = genre;

      try {
        await currentUser.save();
      } catch (error) {
        throw new GraphQLError("Could not set favorite genre", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }

      return currentUser;
    },
  },
};
