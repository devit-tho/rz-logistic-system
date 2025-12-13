import { UserWithoutPassword } from "@monorepo/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialize, login, logout, STORAGE_KEY } from "./auth-thunk";

// ----------------------------------------------------------------------

export interface AuthState {
  user: UserWithoutPassword | null;
  status: "authenticated" | "unauthenticated";
  loading: boolean;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "unauthenticated",
  loading: true,
  token: localStorage.getItem(STORAGE_KEY),
};

// ----------------------------------------------------------------------

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserWithoutPassword>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.status = "unauthenticated";
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(initialize.fulfilled, (state, action) => {
      state.user = action.payload;
      state.status = action.payload ? "authenticated" : "unauthenticated";
      state.loading = false;
    });
    builder.addCase(initialize.rejected, (state) => {
      state.user = null;
      state.status = "unauthenticated";
      state.loading = false;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload as UserWithoutPassword;
      state.status = action.payload ? "authenticated" : "unauthenticated";
      state.loading = false;
    });
    builder.addCase(logout.rejected, (state) => {
      state.user = null;
      state.status = "unauthenticated";
      state.loading = false;
    });
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.status = "unauthenticated";
      state.loading = false;
    });
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;

export default authSlice.reducer;
