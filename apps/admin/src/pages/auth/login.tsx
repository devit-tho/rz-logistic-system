import { RHFTextField } from "@/components/hook-form";
import { LoadingButton } from "@/components/loading-button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useRouter, useSearchParams } from "@/routes/hooks";
import paths from "@/routes/paths";
import { AppDispatch } from "@/stores";
import { login } from "@/stores/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, loginSchema } from "@monorepo/schemas";
import { unwrapResult } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

function LoginPage() {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const searchParams = useSearchParams();

  // const password = useBoolean();

  const returnTo = searchParams.get("returnTo");

  const defaultValues: Omit<LoginSchema, "device"> = {
    email: "sarona-admin@gmail.com",
    password: "sarona123",
  };

  const form = useForm<Omit<LoginSchema, "device">>({
    defaultValues,
    resolver: zodResolver(loginSchema.omit({ device: true })),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (v: Omit<LoginSchema, "device">) => {
    try {
      const resultAction = await dispatch(login(v));
      unwrapResult(resultAction);
      router.replace(returnTo || paths.dashboard.root);
    } catch (error) {
      toast.error(error as string);
      reset();
    }
  });

  return (
    <>
      <title>Login | RZ Logistic</title>

      <div className="flex flex-col gap-6">
        <Card className="overflow-hidden shadow-lg">
          <CardContent className="grid p-0 md:grid-cols-2">
            <Form {...form}>
              <form className="p-6 md:p-8" onSubmit={onSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-primary text-2xl font-bold">
                      Welcome back
                    </h1>
                    <p className="text-primary text-balance">
                      Login to your RZ Logistic account
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <RHFTextField
                      name="email"
                      label="Email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <RHFTextField
                      name="password"
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                    />
                  </div>
                  <LoadingButton
                    type="submit"
                    className="w-full cursor-pointer"
                    loading={isSubmitting}
                  >
                    Login
                  </LoadingButton>
                </div>
              </form>
            </Form>
            <div className="relative hidden self-center md:block">
              <img
                src="/images/logo.png"
                alt="Image"
                className="h-1/2 w-full dark:brightness-[0.2]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default LoginPage;
