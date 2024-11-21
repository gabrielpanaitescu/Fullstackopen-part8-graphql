import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
// import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const authLink = setContext((operation, prevContext) => {
  const token = localStorage.getItem("loggedUser");

  return {
    headers: {
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const apolloClientOptions = {
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
};

export const apolloClient = new ApolloClient(apolloClientOptions);
