import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppRoot, AppRootErrorBoundary } from "./routes/app/root";

const router = createBrowserRouter([
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
    path: "/app",
    element: <AppRoot />,
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
      },
      {
        path: "/app/books",
        lazy: async () => {
          const { Books } = await import("./routes/app/books");
          return {
            Component: Books,
          };
        },
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
  return <RouterProvider router={router} />;
};
