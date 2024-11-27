import { pubsub } from "../index.js";

export const typeDef = `
  type Subscription {
    bookAdded: Book!
  }`;

export const resolvers = {
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
};
