// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { cartApi } from "../api/cartProducts";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer,
    user: userReducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
