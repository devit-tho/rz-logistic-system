import { PropsWithChildren } from "react";

function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex size-full h-dvh items-center justify-center bg-[#E0E0E0]">
      <div className="w-full max-w-sm md:max-w-3xl">{children}</div>
    </main>
  );
}

export default AuthLayout;
