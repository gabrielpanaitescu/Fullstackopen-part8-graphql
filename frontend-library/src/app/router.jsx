import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppRoot, AppRootErrorBoundary } from "./routes/app/root";
import { useApolloClient, useQuery } from "@apollo/client";
import { Navigate } from "react-router-dom";
import { CURRENT_USER } from "../gql/queries";
import { booksLoader } from "./routes/app/books";
import { authorsLoader } from "./routes/app/authors";
import { recommendedLoader } from "./routes/app/recommended";

const ProtectedRoute = ({ children }) => {
  const { data, loading } = useQuery(CURRENT_USER, {
    fetchPolicy: "cache-and-network",
  });

  if (loading) return null;

  if (!data.me) {
    return (
      <Navigate
        to={"/auth/login"}
        replace={true}
        state={{ fromProtected: true }}
      />
    );
  }

  return children;
};

const createAppRouter = (apolloClient) =>
  createBrowserRouter([
    {
      path: "/",
      lazy: async () => {
        const { LandingRoute } = await import("./routes/landing");
        return {
          Component: LandingRoute,
        };
      },
    },
    {
      path: "/auth/login",
      lazy: async () => {
        const { Login } = await import("./routes/auth/login");
        return { Component: Login };
      },
    },
    {
      path: "/auth/register",
      lazy: async () => {
        const { Register } = await import("./routes/auth/register");
        return { Component: Register };
      },
    },
    {
      path: "/app",
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      errorElement: <AppRootErrorBoundary />,
      children: [
        {
          index: true,
          lazy: async () => {
            const { Home } = await import("./routes/app/home");
            return {
              Component: Home,
            };
          },
        },
        {
          path: "/app/authors",
          lazy: async () => {
            const { Authors } = await import("./routes/app/authors");
            return {
              Component: Authors,
            };
          },
          loader: authorsLoader(apolloClient),
        },
        {
          path: "/app/books",
          lazy: async () => {
            const { Books } = await import("./routes/app/books");
            return {
              Component: Books,
            };
          },
          loader: booksLoader(apolloClient),
        },
        {
          path: "/app/add-book",
          lazy: async () => {
            const { AddBook } = await import("./routes/app/add-book");
            return {
              Component: AddBook,
            };
          },
        },
        {
          path: "/app/recommended",
          lazy: async () => {
            const { Recommended } = await import("./routes/app/recommended");
            return {
              Component: Recommended,
            };
          },
          loader: recommendedLoader(apolloClient),
        },
      ],
    },
    {
      path: "*",
      lazy: async () => {
        const { NotFoundRoute } = await import("./routes/not-found");
        return {
          Component: NotFoundRoute,
        };
      },
      ErrorBoundary: AppRootErrorBoundary,
    },
  ]);

export const AppRouter = () => {
  const apolloClient = useApolloClient();
  const router = createAppRouter(apolloClient);

  return (
    <RouterProvider router={router} fallbackElement={<div>loading....</div>} />
  );
};
