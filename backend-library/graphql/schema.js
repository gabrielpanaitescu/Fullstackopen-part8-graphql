import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  typeDef as AuthorTypeDef,
  resolvers as AuthorResolvers,
} from "./author.js";
import { typeDef as BookTypeDef } from "./book.js";
import {
  typeDef as QueryTypeDef,
  resolvers as QueryResolvers,
} from "./query.js";
import {
  typeDef as MutationTypeDef,
  resolvers as MutationResolvers,
} from "./mutation.js";
import { typeDef as TokenTypeDef } from "./token.js";
import { typeDef as UserTypeDef } from "./user.js";
import merge from "lodash/merge.js";
import {
  typeDef as SubscriptionTypeDef,
  resolvers as SubscriptionResolvers,
} from "./subscription.js";

export const schema = makeExecutableSchema({
  resolvers: merge(
    QueryResolvers,
    MutationResolvers,
    AuthorResolvers,
    SubscriptionResolvers
  ),
  typeDefs: [
    QueryTypeDef,
    MutationTypeDef,
    SubscriptionTypeDef,
    AuthorTypeDef,
    BookTypeDef,
    UserTypeDef,
    TokenTypeDef,
  ],
});
