// store/productSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartProduct, Product } from "../products/page";

interface ProductState {
  products: Product[];
  filters: Filters;
}

export interface Filters {
  searchTxt: string;
  category: string;
  rating: number;
  minPrice: string;
  maxPrice: string;
}

const initialState: ProductState = {
  products: [],
  filters: {
    searchTxt: "",
    category: "",
    rating: 1,
    minPrice: "",
    maxPrice: "",
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
    selectCategory(state, action: PayloadAction<string>) {
      state.filters.category = action.payload;
    },
    selectRating(state, action: PayloadAction<number>) {
      state.filters.rating = action.payload;
    },
    setMinPrice(state, action: PayloadAction<string>) {
      state.filters.minPrice = action.payload;
    },
    setMaxPrice(state, action: PayloadAction<string>) {
      state.filters.maxPrice = action.payload;
    },
    setFilters(state, action: PayloadAction<Filters>) {
      state.filters = { ...action.payload };
    },
    clearFilters(state) {
      state.filters = {
        ...state.filters,
        category: "",
        rating: 1,
        minPrice: "",
        maxPrice: "",
      };
    },
  },
});

export const {
  setProducts,
  addSearchText,
  setFilters,
  selectCategory,
  selectRating,
  setMinPrice,
  setMaxPrice,
  clearFilters,
} = productSlice.actions;
export default productSlice.reducer;
