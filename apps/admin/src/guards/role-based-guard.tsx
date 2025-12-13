import paths from "@/routes/paths";
import { RootState } from "@/stores";
import { UserWithoutPassword } from "@monorepo/entities";
import { PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function RoleBasedGuard({ children }: PropsWithChildren) {
  const user = useSelector(
    (state: RootState) => state.auth.user as UserWithoutPassword,
  );

  if (!user.isSuperAdmin) {
    return <Navigate to={paths.base[403]} replace />;
  }

  return <>{children}</>;
}

export default RoleBasedGuard;
