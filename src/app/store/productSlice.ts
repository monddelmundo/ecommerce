// store/productSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartProduct, Product } from "../products/page";

interface ProductState {
  products: Product[];
  filters: {
    searchTxt: string;
  };
}

const initialState: ProductState = {
  products: [],
  filters: {
    searchTxt: "",
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = [...action.payload];
    },
    addSearchText(state, action: PayloadAction<string>) {
      state.filters.searchTxt = action.payload;
    },
  },
});

export const { setProducts, addSearchText } = productSlice.actions;
export default productSlice.reducer;
