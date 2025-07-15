import { Product } from "../products/page";

export const fetchProducts = async (searchTxt: string) => {
  console.log("test", searchTxt);
  const filters = searchTxt
    ? `filters[$or][0][title][$containsi]=${searchTxt}&filters[$or][1][description][$containsi]=${searchTxt}`
    : "";
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?populate=*${
      filters ? `&${filters}` : ""
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
