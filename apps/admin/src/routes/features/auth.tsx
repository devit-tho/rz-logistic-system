import { lazy, Suspense } from "react";
import { Outlet, RouteObject } from "react-router-dom";

// Paths
import { AuthPath } from "@/routes/paths";

// Layout
import AuthLayout from "@/layouts/auth/classic";

// Guard
import { SplashScreen } from "@/components/loading-screen";
import { GuestGuard } from "@/guards";

// Pages
const LoginPage = lazy(() => import("../../pages/auth/login"));

// ----------------------------------------------------------------------

const authRoute: RouteObject[] = [
  {
    path: AuthPath.ROOT,
    element: (
      <GuestGuard>
        <AuthLayout>
          <Suspense fallback={<SplashScreen />}>
            <Outlet />
          </Suspense>
        </AuthLayout>
      </GuestGuard>
    ),
    children: [
      {
        path: AuthPath.LOGIN,
        element: <LoginPage />,
      },
      // {
      //   path: AuthPath.REGISTER,
      //   element: <div>Register</div>,
      // },
    ],
  },
];

export default authRoute;
