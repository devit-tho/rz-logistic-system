import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth";

// ----------------------------------------------------------------------

const stores = configureStore({
  reducer: {
    auth: authReducer,
    // user: userReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof stores.getState>;

export type AppDispatch = typeof stores.dispatch;

export default stores;
