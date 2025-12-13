import { useRouter, useSearchParams } from "@/routes/hooks";
import paths from "@/routes/paths";
import { RootState } from "@/stores";
import { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

function GuestGuard({ children }: PropsWithChildren) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get("returnTo") || paths.dashboard.root;

  const { status } = useSelector((state: RootState) => state.auth);

  const check = () => {
    if (status === "authenticated") {
      router.replace(returnTo);
    }
  };

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}

export default GuestGuard;
