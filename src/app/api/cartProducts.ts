import { Product } from "./../products/page";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CartProduct } from "@/app/products/page";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToCart } from "../store/cartSlice";

type CartProductWithProducts = CartProduct & { products: Product[] };

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include", // 👈 send cookies for auth
  }),
  endpoints: (builder) => ({
    getCart: builder.query<{ data: CartProductWithProducts[] }, void>({
      query: () => "cart-products?populate[products][populate]=*",
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { data: updatedItem } = await queryFulfilled;
        dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            draft.data = [];
            updatedItem.data.forEach((item) => {
              draft.data.push({ ...item, product: item.products[0] }); // assuming draft has a `data` array
            });
          })
        );
      },
    }),
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

export const { useCreateCartItemMutation, useGetCartQuery } = cartApi;

export const addItemAndSyncCart = createAsyncThunk(
  "cart/addItemAndSync",
  async (payload: any, { dispatch, getState }: any) => {
    // 2️⃣ Get cart state
    const state = getState();
    const cartItems: CartProduct[] = state.cart.items; // adjust based on your slice
    // 1️⃣ Dispatch your custom reducer (e.g., cartSlice.actions.addItem)
    dispatch(addToCart(payload));

    const item = payload;
    const existing = cartItems.find((i) => i.product.id === item.product.id);
    if (existing) {
      existing.quantity += item.quantity;
      // @TODO: Update cartitem only
    } else {
      // 3️⃣ Call RTK Query mutation manually
      await dispatch(
        cartApi.endpoints.createCartItem.initiate({
          userDocId: state.user.user.documentId,
          cartProduct: payload,
        })
      ).unwrap();
    }
  }
);

export const fetchCart = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cart-products?populate=*`
  );
  if (!res.ok) throw new Error("Failed to fetch");
  const cartProducts = await res.json();
  return JSON.parse(JSON.stringify(cartProducts.data));
};
