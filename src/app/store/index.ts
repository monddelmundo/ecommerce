// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
