import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import paths from "../paths";

const Page403 = lazy(() => import("@/pages/error/403"));
const Page404 = lazy(() => import("@/pages/error/404"));

const baseRoute: RouteObject[] = [
  {
    path: paths.base.root,
    element: <Navigate to={paths.dashboard.root} replace />,
  },
  {
    path: "*",
    element: <Page404 />,
  },
  {
    path: paths.base[403],
    element: <Page403 />,
  },
];

export default baseRoute;
