import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { authRoute, baseRoute, dashboardRoute } from "./features";
import { usePathname } from "./hooks";

export default function Router() {
  const pathname = usePathname();

  useEffect(() => {
    nprogress.configure({ showSpinner: false });
    nprogress.start();
    nprogress.done();
  }, [pathname]);

  return useRoutes([...baseRoute, ...dashboardRoute, ...authRoute]);
}
