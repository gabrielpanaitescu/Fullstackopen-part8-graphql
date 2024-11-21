import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "react-error-boundary";
import { MainErrorFallback } from "../components/errors/main-error";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../libs/apollo-client";
import { NotificationProvider } from "../contexts/notification";

export const AppProvider = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <HelmetProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </ApolloProvider>
  );
};
