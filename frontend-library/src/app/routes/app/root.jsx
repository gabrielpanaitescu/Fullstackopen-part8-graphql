import { Outlet, useRouteError } from "react-router-dom";
import { AppLayout } from "../../../components/layouts/app-layout";

export const AppRoot = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export const AppRootErrorBoundary = () => {
  const error = useRouteError();
  console.log(error);
  return <div>Something went wrong!</div>;
};
