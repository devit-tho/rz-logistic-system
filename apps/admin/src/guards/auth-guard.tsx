import { useRouter } from "@/routes/hooks";
import { RootState } from "@/stores";
import { PropsWithChildren, useEffect, useState } from "react";
import { useSelector } from "react-redux";

function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter();

  const { status } = useSelector((state: RootState) => state.auth);

  const [checked, setChecked] = useState(false);

  const check = () => {
    if (status === "unauthenticated") {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const href = `/auth/login?${searchParams}`;
      router.replace(href);
    } else {
      setChecked(true);
    }
  };

  useEffect(() => {
    check();
  }, []);

  if (!checked) return null;

  return <>{children}</>;
}

export default AuthGuard;
