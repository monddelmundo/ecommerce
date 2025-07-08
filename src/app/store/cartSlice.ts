// store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartProduct } from "../products/page";

interface CartState {
  items: CartProduct[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartProduct>) {
      const item = action.payload;
      const existing = state.items.find(
        (i) => i.product.id === item.product.id
      );
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },
    subtractQty(state, action: PayloadAction<number>) {
      const existing = state.items.find((i) => i.product.id === action.payload);
      if (existing) {
        existing.quantity -= 1;
        if (existing.quantity === 0) {
          state.items = state.items.filter(
            (item) => item.product.id !== action.payload
          );
        }
      }
    },
    addQty(state, action: PayloadAction<number>) {
      const existing = state.items.find((i) => i.product.id === action.payload);
      if (existing) {
        existing.quantity += 1;
      }
    },
    setCart(state, action: PayloadAction<CartProduct[]>) {
      state.items = { ...action.payload };
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  setCart,
  addQty,
  subtractQty,
} = cartSlice.actions;
export default cartSlice.reducer;
