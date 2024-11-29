import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
// import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000",
  })
);

const authLink = setContext((operation, prevContext) => {
  const token = localStorage.getItem("loggedUser");

  if (operation.operationName === "Login") return;

  return {
    headers: {
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const splitLink = split(
  (operation) => {
    const definition = getMainDefinition(operation.query);

    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const apolloClientOptions = {
  cache: new InMemoryCache(),
  link: splitLink,
};

export const apolloClient = new ApolloClient(apolloClientOptions);
