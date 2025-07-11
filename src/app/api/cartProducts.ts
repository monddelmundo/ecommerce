import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CartProduct } from "@/app/products/page";
import { createAsyncThunk } from "@reduxjs/toolkit";
import cartSlice, { addToCart } from "../store/cartSlice";
export const createCartProduct = async (
  cartProduct: CartProduct,
  userDocId: string
) => {
  const dataToSend = {
    data: {
      quantity: cartProduct.quantity,
      isChecked: cartProduct.isChecked,
      products: {
        connect: [cartProduct.product.documentId],
      },
      user: userDocId,
    },
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart-products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(dataToSend),
  });
  if (!res.ok) throw new Error("Failed to authenticate");
  return res.json();
};

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include", // 👈 send cookies for auth
  }),
  endpoints: (builder) => ({
    createCartItem: builder.mutation<
      any,
      { userDocId: string; cartProduct: CartProduct }
    >({
      query: ({ cartProduct, userDocId }) => ({
        url: "/cart-products",
        method: "POST",
        body: {
          data: {
            user: userDocId,
            products: {
              connect: [cartProduct.product.documentId],
            },
            isChecked: cartProduct.isChecked,
            quantity: cartProduct.quantity,
          },
        },
      }),
    }),
  }),
});

export const { useCreateCartItemMutation } = cartApi;

export const addItemAndSyncCart = createAsyncThunk(
  "cart/addItemAndSync",
  async (payload: any, { dispatch, getState }: any) => {
    // 1️⃣ Dispatch your custom reducer (e.g., cartSlice.actions.addItem)
    dispatch(addToCart(payload));

    // 2️⃣ Get updated cart state
    const state = getState();
    const cartItems = state.cart.items; // adjust based on your slice

    // 3️⃣ Call RTK Query mutation manually
    await dispatch(
      cartApi.endpoints.createCartItem.initiate({
        userDocId: state.user.user.documentId,
        cartProduct: cartItems[0],
      })
    ).unwrap();
  }
);
