import paths from "@/routes/paths";
import { RootState } from "@/stores";
import { UserWithoutPassword } from "@monorepo/entities";
import {
  BookText,
  BoxesIcon,
  BoxIcon,
  LayoutDashboardIcon,
  LucideShirt,
  SailboatIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export interface List {
  path: string;
  title: string;
  icon?: React.ReactNode;
  childrens?: List[];
}

export const useNavData = (): List[] => {
  const user = useSelector(
    (state: RootState) => state.auth.user as UserWithoutPassword,
  );

  const sidebarLists = useMemo<List[]>(() => {
    const baseNav: List[] = [
      {
        icon: <LayoutDashboardIcon />,
        path: paths.dashboard.root,
        title: "Dashboard",
      },
      {
        icon: <LucideShirt />,
        path: paths.dashboard.shipment.root,
        title: "Shipment",
      },
      { icon: <BoxIcon />, path: paths.dashboard.cargo.root, title: "Cargo" },
      {
        icon: <TruckIcon />,
        path: paths.dashboard.truckingManagement.root,
        title: "Trucking Management",
      },
      {
        icon: <UserIcon />,
        path: paths.dashboard.driver.root,
        title: "Driver",
      },
      {
        icon: <SailboatIcon />,
        path: paths.dashboard.shippingLine.root,
        title: "Shipping Line",
      },
      {
        icon: <BoxesIcon />,
        path: paths.dashboard.supplier.root,
        title: "Supplier",
      },
      {
        icon: <UserIcon />,
        path: paths.dashboard.customer.root,
        title: "Customer",
      },
      { icon: <UserIcon />, path: paths.dashboard.broker, title: "Broker" },
      { icon: <BookText />, path: paths.dashboard.report, title: "Report" },
    ];

    const adminNav: List[] = user.isSuperAdmin
      ? [{ icon: <UserIcon />, path: paths.dashboard.user, title: "User" }]
      : [];

    return [...baseNav, ...adminNav];
  }, [user.isSuperAdmin]);

  return sidebarLists;
};
