import { AppDispatch, RootState } from "@/stores";
import { initialize } from "@/stores/auth";
import { PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SplashScreen } from "../loading-screen";

// ----------------------------------------------------------------------

function Authentication({ children }: PropsWithChildren) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  if (loading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

export default Authentication;
