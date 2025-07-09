import { useDispatch } from "react-redux";
import { setProducts } from "../store/productSlice";

export const fetchProducts = async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};
