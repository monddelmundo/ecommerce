"use client";
import ViewCartPopup from "@/components/ViewCartPopup";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { fetchProducts } from "../api/products";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import ErrorBoundary from "@/components/ReactBoundary";
import CategoryItem from "@/components/CategoryItem";
import { Divider, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { addToCart, setCart } from "../store/cartSlice";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ListIcon from "@mui/icons-material/List";
import RatingList from "@/components/RatingList";
import BasicTextField from "@/components/Textfield";
import { setProducts } from "../store/productSlice";

type Rating = {
  rate: number;
  count: number;
};
export type Product = {
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
  const filters = useSelector((state: RootState) => state.product.filters);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRating, setSelectedRating] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  console.log(filters.searchTxt);
  const {
    data: products,
    isLoading,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    if (isSuccess && products) {
      dispatch(setProducts(products));
    }
  }, [isSuccess, products, dispatch]);

  const filteredProducts = (): Product[] => {
    if (products?.length > 0) {
      let finalProducts = [...products];
      if (minPrice && maxPrice) {
        finalProducts = finalProducts.filter(
          (product: Product) =>
            product.price >= Number(minPrice) &&
            product.price <= Number(maxPrice)
        );
      }

      if (filters.searchTxt) {
        finalProducts = finalProducts.filter(
          (product: Product) =>
            product.title
              .toLowerCase()
              .includes(filters.searchTxt.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(filters.searchTxt.toLowerCase())
        );
      }

      if (selectedCategory) {
        finalProducts = finalProducts.filter(
          (product: Product) => product.category === selectedCategory
        );
      }
      finalProducts = finalProducts
        ?.filter((product: Product) => product.rating.rate >= selectedRating)
        ?.filter((product: Product) => product.rating.rate >= selectedRating);
      return finalProducts;
    } else return [];
  };

  const paginatedItems = filteredProducts().slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts().length / itemsPerPage);
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

  const handleRatingItemClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleChange = (
    value: string,
    setter: Dispatch<SetStateAction<string>>
  ) => {
    const numeric = value.replace(/\D/g, ""); // Remove non-digits
    setter(numeric);
  };

  const handleClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategory("");
    setSelectedRating(1);
  };

  return (
    <ErrorBoundary>
      <div className="p-8 bg-gray-50 min-h-screen">
        {isOpen && <ViewCartPopup onClose={() => setIsOpen(false)} />}
        <div className="mt-5 w-4/6 mx-auto grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="col-span-2">
            <>
              <h3
                onClick={() => setSelectedCategory("")}
                className="mb-5 cursor-pointer"
              >
                <ListIcon className="mr-2" fontSize="small" />
                All Categories
              </h3>
              {isLoading ? (
                <Loader />
              ) : (
                getCategories().map((category) => {
                  return (
                    <CategoryItem
                      key={category}
                      isActive={selectedCategory === category}
                      categoryTitle={category}
                      onClick={() => handleClickCategoryItem(category)}
                    />
                  );
                })
              )}
              <Divider flexItem />
              <h3 className="my-5">
                <FilterAltOutlinedIcon className="mr-2" fontSize="small" />
                Search Filter
              </h3>
              <h4>Rating</h4>
              <RatingList
                selectedRating={selectedRating}
                onClick={handleRatingItemClick}
              />
              <Divider flexItem />
              <h4 className="mt-5">Price Range</h4>
              <div className="flex justify-start gap-2 mb-5">
                <BasicTextField
                  id="min-text"
                  label=""
                  handleChange={(e) =>
                    handleChange(e.target.value, setMinPrice)
                  }
                  value={minPrice}
                  placeholder="MIN"
                  className="mr-1 w-25"
                />
                &mdash;
                <BasicTextField
                  id="min-text"
                  label=""
                  handleChange={(e) =>
                    handleChange(e.target.value, setMaxPrice)
                  }
                  value={maxPrice}
                  placeholder="MAX"
                  className="ml-1 w-25"
                />
              </div>
              <Divider flexItem />
              <Button onClick={handleClearFilters} title="Clear All" />
            </>
          </div>
          <div className="col-span-5">
            <div className="flex justify-end mt-6 gap-2 mb-5">
              <span className="text-[#FE9920]">{currentPage}</span>
              {` / ${totalPages}`}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-sm cursor-pointer rounded disabled:opacity-50"
              >
                &lt;
              </button>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 text-sm rounded cursor-pointer disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
            {isLoading ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {paginatedItems?.length > 0 &&
                  paginatedItems.map((product: Product) => (
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
                          <h2 className="text-sm font-semibold line-clamp-2">
                            {product.title}
                          </h2>
                        </Tooltip>
                        <Tooltip
                          title={product.description}
                          enterDelay={600}
                          enterNextDelay={600}
                          placement="top"
                        >
                          <div className="text-[#364652] text-sm mt-1 line-clamp-3">
                            {product.description}
                          </div>
                        </Tooltip>
                        <p className="text-[#364652] font-bold mt-3">
                          ${product.price.toFixed(2)}
                        </p>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          title="Add to Cart"
                        />
                      </div>
                    </div>
                  ))}
                {filteredProducts().length === 0 && <h3>No item found.</h3>}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProductPage;
