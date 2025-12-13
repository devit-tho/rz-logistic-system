import { lazy, Suspense } from "react";
import { Outlet, RouteObject } from "react-router-dom";

// Path
import { DashboardPath } from "@/routes/paths";

// Layout
import DashboardLayout from "@/layouts/dashboard/classic";

// Guard
import { LoadingScreen } from "@/components/loading-screen";
import { AuthGuard, RoleBasedGuard } from "@/guards";

// Pages
const IndexPage = lazy(() => import("@/pages/dashboard/app"));
const CargoPage = lazy(() => import("@/pages/dashboard/cargo"));
const ShipmentPage = lazy(() => import("@/pages/dashboard/shipment"));
const ShippingLinePage = lazy(() => import("@/pages/dashboard/shipping-line"));
const CustomerPage = lazy(() => import("@/pages/dashboard/customer"));
const TruckingManagementPage = lazy(
  () => import("@/pages/dashboard/trucking-management"),
);
const DriverPage = lazy(() => import("@/pages/dashboard/driver"));
const SupplierPage = lazy(() => import("@/pages/dashboard/supplier"));
const SettingsPage = lazy(() => import("@/pages/dashboard/settings"));
const BrokerPage = lazy(() => import("@/pages/dashboard/broker"));
const UserPage = lazy(() => import("@/pages/dashboard/user"));
const ReportPage = lazy(() => import("@/pages/dashboard/report"));

// ----------------------------------------------------------------------

const dashboardRoute: RouteObject[] = [
  {
    path: DashboardPath.ROOT,
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: DashboardPath.SHIPMENT,
        element: <ShipmentPage />,
      },
      {
        path: DashboardPath.CARGO,
        element: <CargoPage />,
      },
      { path: DashboardPath.SHIPPING_LINE, element: <ShippingLinePage /> },
      {
        path: DashboardPath.TRUCKING_MANAGEMENT,
        element: <TruckingManagementPage />,
      },
      { path: DashboardPath.DRIVER, element: <DriverPage /> },
      { path: DashboardPath.SUPPLIER, element: <SupplierPage /> },
      { path: DashboardPath.CUSTOMER, element: <CustomerPage /> },
      {
        path: DashboardPath.BROKER,
        element: <BrokerPage />,
      },
      {
        path: DashboardPath.REPORT,
        element: <ReportPage />,
      },
      { path: DashboardPath.SETTINGS, element: <SettingsPage /> },
      {
        path: DashboardPath.USER,
        element: (
          <RoleBasedGuard>
            <UserPage />
          </RoleBasedGuard>
        ),
      },
    ],
  },
];

export default dashboardRoute;
