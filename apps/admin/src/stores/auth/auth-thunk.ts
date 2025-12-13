import { Api, ApiError } from "@/api";
import { getDevice } from "@/config/axios";
import { isValidToken, setSession } from "@/utils/auth-utils";
import { UserWithoutPassword } from "@monorepo/entities";
import { LoginSchema } from "@monorepo/schemas";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { mutate } from "swr";

// ----------------------------------------------------------------------

export const STORAGE_KEY = "token";

// ----------------------------------------------------------------------

export const initialize = createAsyncThunk<UserWithoutPassword | null>(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    const accessToken = localStorage.getItem(STORAGE_KEY);

    if (accessToken && isValidToken(accessToken)) {
      setSession(accessToken);
      try {
        const currentUser = await Api.user.me();

        mutate(() => true, undefined, { revalidate: false });

        return currentUser;
      } catch (err) {
        return rejectWithValue("Failed to fetch user");
      }
    } else {
      setSession(null);
      return null;
    }
  },
);

// ----------------------------------------------------------------------

export const login = createAsyncThunk<
  UserWithoutPassword | undefined,
  Omit<LoginSchema, "device">
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const device = getDevice();
    const data = await Api.user.login({ email, password, device });
    setSession(data.token);
    return data.user;
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to login");
  }
});

// ----------------------------------------------------------------------

export const logout = createAsyncThunk<void, void>("auth/logout", async () => {
  await Api.user.logout();
  setSession(null);
});
