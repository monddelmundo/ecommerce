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
      const itemsClone = [...state.items];
      const existing = itemsClone.find((i) => i.product.id === item.product.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        itemsClone.push(item);
      }
      state.items = itemsClone;
    },
    checkUncheck(
      state,
      action: PayloadAction<{ id: number; isChecked: boolean }>
    ) {
      const newItems = [...state.items];
      const existing = newItems.find((i) => i.product.id === action.payload.id);
      if (existing) {
        existing.isChecked = action.payload.isChecked;
      }
      state.items = newItems;
    },
    checkUncheckAll(state, action: PayloadAction<boolean>) {
      state.items = state.items.map((item: CartProduct) => ({
        ...item,
        isChecked: action.payload,
      }));
    },
    subtractQty(state, action: PayloadAction<number>) {
      const newItems = [...state.items];
      const existing = newItems.find((i) => i.product.id === action.payload);
      if (existing) {
        existing.quantity -= 1;
        if (existing.quantity === 0) {
          state.items = newItems.filter(
            (item) => item.product.id !== action.payload
          );
        }
      }
    },
    addQty(state, action: PayloadAction<number>) {
      const newItems = [...state.items];
      const existing = newItems.find((i) => i.product.id === action.payload);
      if (existing) {
        existing.quantity += 1;
      }
      state.items = newItems;
    },
    setCart(state, action: PayloadAction<CartProduct[]>) {
      state.items = action.payload;
    },
    updateCartItem(state, action: PayloadAction<CartProduct>) {
      state.items = state.items.map((cartProduct: CartProduct) => {
        if (action.payload.product.id === cartProduct.product.id) {
          return action.payload;
        }
        return cartProduct;
      });
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
  updateCartItem,
  checkUncheck,
  checkUncheckAll,
  subtractQty,
} = cartSlice.actions;
export default cartSlice.reducer;
