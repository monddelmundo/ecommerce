import { Product } from "./../products/page";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CartProduct } from "@/app/products/page";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToCart, removeFromCart, updateCartItem } from "../store/cartSlice";

type CartProductWithProducts = CartProduct & { products: Product[] };

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include", // 👈 send cookies for auth
  }),
  endpoints: (builder) => ({
    getCart: builder.query<{ data: CartProductWithProducts[] }, void>({
      query: () =>
        "cart-products?sort[0]=updatedAt:desc&populate[products][populate]=*",
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
        url: "/cart-products?populate[products][populate]=*",
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
    updateCartItem: builder.mutation<any, { cartProduct: CartProduct }>({
      query: ({ cartProduct }) => ({
        url: `/cart-products/${cartProduct.documentId}`,
        method: "PUT",
        body: {
          data: {
            isChecked: cartProduct.isChecked,
            quantity: cartProduct.quantity,
          },
        },
      }),
    }),
    removeCartItem: builder.mutation<any, { cartProduct: CartProduct }>({
      query: ({ cartProduct }) => ({
        url: `/cart-products/${cartProduct.documentId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCartItemMutation,
  useUpdateCartItemMutation,
  useGetCartQuery,
} = cartApi;

export const addItemAndSyncCart = createAsyncThunk(
  "cart/addItemAndSync",
  async (payload: any, { dispatch, getState }: any) => {
    // 2️⃣ Get cart state
    const state = getState();
    const cartItems: CartProduct[] = [...state.cart.items]; // adjust based on your slice
    // 1️⃣ Dispatch your custom reducer (e.g., cartSlice.actions.addItem)
    dispatch(addToCart(payload));

    const item = payload;
    const existing = cartItems.find((i) => i.product.id === item.product.id);
    try {
      if (existing) {
        await dispatch(
          cartApi.endpoints.updateCartItem.initiate({
            cartProduct: { ...existing, quantity: existing.quantity + 1 },
          })
        ).unwrap();
      } else {
        // 3️⃣ Call RTK Query mutation manually
        const result = await dispatch(
          cartApi.endpoints.createCartItem.initiate({
            userDocId: state.user.user.documentId,
            cartProduct: payload,
          })
        ).unwrap();
        dispatch(
          updateCartItem({ ...result.data, product: result.data.products[0] })
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
);

export const updateItemAndSyncCart = createAsyncThunk(
  "cart/updateItemAndSync",
  async (payload: any, { dispatch, getState }: any) => {
    // 2️⃣ Get cart state
    const state = getState();
    const cartItems: CartProduct[] = [...state.cart.items]; // adjust based on your slice
    // 1️⃣ Dispatch your custom reducer (e.g., cartSlice.actions.addItem)
    if (payload.quantity === 0) dispatch(removeFromCart(payload.product.id));
    else dispatch(updateCartItem(payload));

    const item = payload;
    const existing = cartItems.find((i) => i.product.id === item.product.id);
    try {
      if (existing) {
        if (payload.quantity === 0) {
          await dispatch(
            cartApi.endpoints.removeCartItem.initiate({
              cartProduct: { ...item },
            })
          ).unwrap();
        } else {
          await dispatch(
            cartApi.endpoints.updateCartItem.initiate({
              cartProduct: { ...item },
            })
          ).unwrap();
        }
      }
    } catch (error) {
      console.error(error);
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
