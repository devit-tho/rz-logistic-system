import { Api, ApiError } from "@/api";
import { RHFTextField } from "@/components/hook-form";
import { LoadingButton } from "@/components/loading-button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppDispatch, RootState } from "@/stores";
import { setUser } from "@/stores/auth/auth-slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserWithoutPassword } from "@monorepo/entities";
import {
  changePasswordSchema,
  ChangePasswordSchema,
  updateUserSchema,
  UpdateUserSchema,
} from "@monorepo/schemas";
import { capitalCase } from "change-case";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function SettingsPage() {
  const tabs = [
    {
      value: "account",
      content: <Account />,
    },
    {
      value: "password",
      content: <Password />,
    },
  ];

  return (
    <>
      <title>Settings | RZ Logistic System</title>

      <div className="flex w-full flex-col gap-6">
        <Tabs defaultValue="account">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {capitalCase(tab.value)}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}

export default SettingsPage;

function Account() {
  const user = useSelector(
    (state: RootState) => state.auth.user as UserWithoutPassword,
  );
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<UpdateUserSchema>({
    defaultValues: {
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
    },
    resolver: zodResolver(updateUserSchema),
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (v) => {
    await Api.user.updateUser(v);
    toast.success("Saved successfully");
    dispatch(setUser({ ...user, ...v }));
  });

  return (
    <>
      <Form {...form}>
        <form
          className="flex max-w-full flex-col gap-y-4 py-3 md:max-w-xl"
          onSubmit={onSubmit}
        >
          <RHFTextField name="name" label="Name" />

          <RHFTextField
            name="email"
            label="Email"
            disabled={!user.isSuperAdmin}
            description={
              !user.isSuperAdmin ? (
                <>
                  You are not allowed to change the email. If you want to change
                  your email, please contact the admin.
                </>
              ) : undefined
            }
          />

          <div className="flex justify-end">
            <LoadingButton loading={isSubmitting}>Save Changes</LoadingButton>
          </div>
        </form>
      </Form>
    </>
  );
}

function Password() {
  const defaultValues: ChangePasswordSchema = {
    password: "",
    newPassword: "",
    confirmPassword: "",
  };

  const form = useForm<ChangePasswordSchema>({
    defaultValues,
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = form;

  const onSubmit = handleSubmit(async (v) => {
    try {
      await Api.user.changePassword(v);
      toast.success("Changed successfully");
    } catch (err) {
      if (err instanceof ApiError) {
        setError("password", {
          message: err.message,
        });
      }
    }
  });

  return (
    <Form {...form}>
      <form
        className="flex max-w-full flex-col gap-y-4 py-3 md:max-w-xl"
        onSubmit={onSubmit}
      >
        <RHFTextField
          name="password"
          type="password"
          label="Current Password"
          placeholder="Enter your current password"
        />

        <RHFTextField
          name="newPassword"
          type="password"
          label="New Password"
          placeholder="Enter your new password"
        />

        <RHFTextField
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Enter your confirm password"
        />

        <div className="flex justify-end">
          <LoadingButton loading={isSubmitting}>Save Changes</LoadingButton>
        </div>
      </form>
    </Form>
  );
}
