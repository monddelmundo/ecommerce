"use client";
import ViewCartPopup from "@/components/ViewCartPopup";
import { useState, useEffect, Dispatch, SetStateAction, useMemo } from "react";
import { fetchCategories, fetchProducts } from "../api/products";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import ErrorBoundary from "@/components/ReactBoundary";
import CategoryItem from "@/components/CategoryItem";
import { Divider, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { addToCart } from "../store/cartSlice";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ListIcon from "@mui/icons-material/List";
import RatingList from "@/components/RatingList";
import BasicTextField from "@/components/Textfield";
import {
  clearFilters,
  selectCategory,
  selectRating,
  setMaxPrice,
  setMinPrice,
  setProducts,
} from "../store/productSlice";
import { addItemAndSyncCart } from "../api/cartProducts";
import { useAppDispatch } from "../hooks";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

type Rating = {
  rate: number;
  count: number;
};
export type Product = {
  id: number;
  title: string;
  documentId: string;
  category: string;
  description: string;
  price: number;
  rating: Rating;
  image: {
    url: string;
  };
};

export type CartProduct = {
  quantity: number;
  product: Product;
  isChecked: boolean;
  documentId: string;
  updatedAt: Date;
  // @TODO: Add delisted value
};

const ProductPage = () => {
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const filters = useSelector((state: RootState) => state.product.filters);
  const user = useSelector((state: RootState) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [shouldApplyPriceFilters, setShouldApplyPriceFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const {
    data: products,
    refetch,
    isLoading,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(filters),
  });
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    refetch();
  }, [filters]);

  useEffect(() => {
    if (isSuccess && products) {
      dispatch(setProducts(products));
    }
  }, [isSuccess, products, dispatch]);

  const filteredProducts = useMemo((): Product[] => {
    if (products?.length > 0) {
      let finalProducts = [...products];

      setCurrentPage(1);
      setShouldApplyPriceFilters(false);
      return finalProducts;
    } else return [];
  }, [filters, products, shouldApplyPriceFilters]);

  const paginatedItems = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAddToCart = async (product: Product) => {
    try {
      if (user.user?.documentId) {
        await appDispatch(
          addItemAndSyncCart({ quantity: 1, isChecked: true, product })
        );
      }
      toast.success("Item added to cart.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickCategoryItem = (category: string) => {
    if (category === filters.category) dispatch(selectCategory(""));
    else dispatch(selectCategory(category));
    setCurrentPage(1);
  };

  const handleRatingItemClick = (rating: number) => {
    dispatch(selectRating(rating));
    setCurrentPage(1);
  };

  const handleChange = (
    value: string,
    setter: ActionCreatorWithPayload<string>
  ) => {
    const numeric = value.replace(/\D/g, ""); // Remove non-digits
    dispatch(setter(numeric));
    setCurrentPage(1);

    if (filters.minPrice && filters.maxPrice) setShouldApplyPriceFilters(true);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setCurrentPage(1);
    setShouldApplyPriceFilters(true);
  };

  return (
    <ErrorBoundary>
      <div className="p-8 bg-gray-50 min-h-screen">
        {isOpen && <ViewCartPopup onClose={() => setIsOpen(false)} />}
        <div className="w-4/6 mx-auto grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="col-span-2">
            <>
              <h3
                onClick={() => dispatch(selectCategory(""))}
                className="mb-5 cursor-pointer"
              >
                <ListIcon className="mr-2" fontSize="small" />
                All Categories
              </h3>
              {isLoadingCategories ? (
                <Loader />
              ) : (
                categories?.map((category: string) => {
                  return (
                    <CategoryItem
                      key={category}
                      isActive={filters.category === category}
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
                selectedRating={filters.rating}
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
                  value={filters.minPrice}
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
                  value={filters.maxPrice}
                  placeholder="MAX"
                  className="ml-1 w-25"
                />
              </div>
              <Divider flexItem />
              <Button onClick={handleClearFilters} title="Clear All" />
            </>
          </div>
          <div className="col-span-5">
            {paginatedItems?.length > 0 && (
              <div className="flex justify-end mt-6 gap-2 mb-5">
                <span className="text-[#FE9920]">{currentPage}</span>
                {` / ${totalPages}`}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
            )}
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
                        src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}${product.image.url}`}
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
                {!isLoading && filteredProducts.length === 0 && (
                  <h3>No item found.</h3>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProductPage;
