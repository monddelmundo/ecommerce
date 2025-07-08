"use client";
import ViewCartPopup from "@/components/ViewCartPopup";
import { useState, useEffect } from "react";
import { fetchProducts } from "../api/products";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import ErrorBoundary from "@/components/ReactBoundary";
import CategoryItem from "@/components/CategoryItem";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { addToCart, setCart } from "../store/cartSlice";

type Rating = {
  rate: number;
  count: number;
};
type Product = {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number;
  rating: Rating;
  image: string;
};

export type CartProduct = {
  quantity: number;
  product: Product;
};

const ProductPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  //   const [cart, setCart] = useState<CartProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const finalProducts = selectedCategory
    ? products?.filter(
        (product: Product) => product.category === selectedCategory
      )
    : products;

  const getCategories = () => {
    const categories = new Map();
    products?.forEach((product: Product) => {
      categories.set(product.category, product.category);
    });
    return Array.from(categories.keys());
  };

  const handleAddToCart = (product: Product) => {
    try {
      dispatch(addToCart({ product, quantity: 1 }));
      toast.success("Item added to cart.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickCategoryItem = (category: string) => {
    if (category === selectedCategory) setSelectedCategory("");
    else setSelectedCategory(category);
  };

  return (
    <ErrorBoundary>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-black text-3xl font-bold mb-6">Product Catalog</h1>
        <h3 className="text-black">
          You have {cart.length} item(s) on your{" "}
          <span
            onClick={() => setIsOpen(true)}
            className="underline text-blue-500 cursor-pointer"
          >
            cart
          </span>
          .
        </h3>
        {isOpen && <ViewCartPopup onClose={() => setIsOpen(false)} />}
        <div className="mt-10 w-4/6 mx-auto grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="col-span-1">
            <>
              <h3
                onClick={() => setSelectedCategory("")}
                className="mb-5 cursor-pointer"
              >
                All Categories
              </h3>
              {getCategories().map((category) => {
                return (
                  <CategoryItem
                    isActive={selectedCategory === category}
                    categoryTitle={category}
                    onClick={() => handleClickCategoryItem(category)}
                  />
                );
              })}
            </>
          </div>
          <div className="col-span-5">
            {isLoading ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {finalProducts?.map((product: Product) => (
                  <div
                    key={product.id}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-contain"
                    />
                    <div className="p-4">
                      <Tooltip
                        title={product.title}
                        enterDelay={600}
                        enterNextDelay={600}
                        placement="top"
                      >
                        <h2 className="text-md font-semibold line-clamp-2">
                          {product.title}
                        </h2>
                      </Tooltip>
                      <Tooltip
                        title={product.description}
                        enterDelay={600}
                        enterNextDelay={600}
                        placement="top"
                      >
                        <div className="text-gray-600 text-sm mt-1 line-clamp-3">
                          {product.description}
                        </div>
                      </Tooltip>
                      <p className="text-blue-600 font-bold mt-3">
                        ${product.price.toFixed(2)}
                      </p>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        title="Add to Cart"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProductPage;
