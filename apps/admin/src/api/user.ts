import { getData } from "@/config/axios";
import { swrOption } from "@/utils/swr-option";
import { LoginResponse, UserWithoutPassword } from "@monorepo/entities";
import {
  ChangePasswordSchema,
  ChangeUserEmailSchema,
  CreateUserSchema,
  LoginSchema,
  ResetPasswordSchema,
  UpdateUserSchema,
  UserSearchResult,
  UserSearchSchema,
} from "@monorepo/schemas";
import isEmpty from "lodash/isEmpty";
import { stringify } from "qs";
import { useMemo } from "react";
import useSWR from "swr";
import { Api } from ".";

export function useSearchUsers(query: UserSearchSchema) {
  const swrKey = useMemo(() => ["/api/v1/user/search", query], [query]);

  const {
    data: user,
    isLoading,
    error,
    isValidating,
    mutate,
  } = useSWR<UserSearchResult>(
    swrKey,
    ([_, q]) => Api.user.searchUsers(q),
    swrOption,
  );

  const memoizedUsers = useMemo(
    () => ({
      usersData: user?.datas || [],
      usersMeta: user?.meta,
      usersLoading: isLoading || isValidating,
      usersError: error,
      usersEmpty: (!isLoading || !isValidating) && isEmpty(user?.datas),
      usersMutate: mutate,
    }),
    [user, isLoading, error, isValidating, mutate],
  );

  return memoizedUsers;
}

export default {
  async login(data: LoginSchema): Promise<LoginResponse> {
    return getData<LoginResponse>(
      await Api.client("/api/v1/auth/login", false).post("", data),
    );
  },
  async me(): Promise<UserWithoutPassword> {
    return getData<UserWithoutPassword>(
      await Api.client("/api/v1/auth").get("current-user"),
    );
  },
  async logout() {
    await Api.client("/api/v1/auth").delete("/logout");
  },
  async searchUsers(data: UserSearchSchema): Promise<UserSearchResult> {
    const query = stringify(data, { skipNulls: true });

    return getData<UserSearchResult>(
      await Api.client("/api/v1/user/search").get(`?${query}`),
    );
  },
  async createUser(data: CreateUserSchema): Promise<UserWithoutPassword> {
    return getData<UserWithoutPassword>(
      await Api.client("/api/v1/user").post("/create", data),
    );
  },
  async updateUser(data: UpdateUserSchema) {
    await Api.client("/api/v1/user").patch("/update", data);
  },
  async changeUserEmail(data: ChangeUserEmailSchema) {
    await Api.client("/api/v1/user").patch(`/change-user-email`, data);
  },
  async changePassword(data: ChangePasswordSchema) {
    await Api.client("/api/v1/user").patch(`/change-password`, data);
  },
  async resetPassword(data: ResetPasswordSchema) {
    await Api.client("/api/v1/user").patch(`/reset-password`, data);
  },
};
