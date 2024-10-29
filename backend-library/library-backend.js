import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";
import { GraphQLError } from "graphql";
import { v1 as uuid } from "uuid";

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: String!

  } type Book {
    title: String!
    published: String!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Query {
    authorCount: String!
    bookCount: String!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: String!
      genres: [String!]!
    ): Book!

    editAuthor(name: String, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Query: {
    authorCount: () => authors.length,
    bookCount: () => books.length,
    allBooks: (_, { author, genre }) => {
      if (author && genre) {
        const booksByAuthorAndGenre = books.filter(
          (book) => book.author === author && book.genres.includes(genre)
        );
        if (booksByAuthorAndGenre.length === 0)
          throw new GraphQLError(
            `Book by ${author}, with genre ${genre} not found in library`,
            {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: [author, genre],
              },
            }
          );
        return booksByAuthorAndGenre;
      } else if (genre) {
        const booksByGenre = books.filter((book) =>
          book.genres.includes(genre)
        );
        if (booksByGenre.length === 0)
          throw new GraphQLError(
            `Book with genre ${genre} not found in library`,
            {
              extensions: { code: "BAD_USER_INPUT", invalidArgs: genre },
            }
          );
        return booksByGenre;
      } else if (author) {
        const booksByAuthor = books.filter((book) => book.author === author);

        if (booksByAuthor.length === 0)
          throw new GraphQLError(`Book by ${author} not found in library`, {
            extensions: { code: "BAD_USER_INPUT", invalidArgs: author },
          });

        return booksByAuthor;
      }

      return books;
    },
    allAuthors: () => authors,
  },
  Mutation: {
    addBook: (_, args) => {
      const foundBook = books.find((book) => book.title === args.title);

      if (foundBook)
        throw new GraphQLError("Book already exists", {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args.title },
        });

      const newBook = { ...args, id: uuid() };
      books = books.concat(newBook);

      const foundAuthor = authors.find((author) => author.name === args.author);

      if (!foundAuthor) {
        const newAuthor = {
          name: args.author,
          id: uuid(),
        };
        authors = authors.concat(newAuthor);
      }

      return newBook;
    },
    editAuthor: (_, args) => {
      const foundAuthor = authors.find((author) => author.name === args.name);
      console.log(foundAuthor);
      if (!foundAuthor) return null;

      const editedAuthor = {
        ...foundAuthor,
        born: args.setBornTo,
      };

      authors = authors.map((author) =>
        author.name === foundAuthor.name ? editedAuthor : author
      );

      return editedAuthor;
    },
  },
  Author: {
    bookCount: (parent) => {
      return books.filter((book) => book.author === parent.name).length;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`Server running at ${url}`);
