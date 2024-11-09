import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "react-error-boundary";
import { MainErrorFallback } from "../components/errors/main-error";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

export const AppProvider = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <HelmetProvider>{children}</HelmetProvider>
      </ErrorBoundary>
    </ApolloProvider>
  );
};
