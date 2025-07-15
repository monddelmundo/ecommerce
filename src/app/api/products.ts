import { Product } from "../products/page";
import { Filters } from "../store/productSlice";

export const fetchProducts = async (filters: Filters) => {
  let finalFilters = "";
  if (filters.searchTxt)
    finalFilters += `filters[$or][0][title][$containsi]=${filters.searchTxt}&filters[$or][1][description][$containsi]=${filters.searchTxt}&`;

  if (filters.category)
    finalFilters += `filters[category][$eqi]=${filters.category}&`;

  if (filters.rating) finalFilters += `filters[rate][$gte]=${filters.rating}&`;
  if (filters.minPrice && filters.maxPrice)
    finalFilters += `filters[$and][0][price][$gte]=${filters.minPrice}&filters[$and][1][price][$lte]=${filters.maxPrice}&`;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?populate=*${
      finalFilters ? `&${finalFilters}` : ""
    }`
  );
  if (!res.ok) throw new Error("Failed to fetch");
  const products = await res.json();
  return products.data.map(
    (item: Product & { rate: number; count: number }) => ({
      ...item,
      rating: { rate: item.rate, count: item.count },
    })
  );
};

export const fetchCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/unique-categories`
  );
  const products = await res.json();
  return products;
};
