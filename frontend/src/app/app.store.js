import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/auth.slice.js";
import dashboardReducer from "../features/Dashboard/store/dashboard.slice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
  },
});

