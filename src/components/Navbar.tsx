"use client";

import React, { useCallback, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import BasicTextField from "./Textfield";
import { useDispatch, useSelector } from "react-redux";
import { addSearchText } from "@/app/store/productSlice";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ViewCartPopup from "./ViewCartPopup";
import { RootState } from "@/app/store";
import { Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/app/api/auth";
import { setUser } from "@/app/store/userSlice";
import { toast } from "react-toastify";
import { useGetCartQuery } from "@/app/api/cartProducts";
import { setCart } from "@/app/store/cartSlice";

const Navbar: React.FC = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const userDetails = useSelector((state: RootState) => state.user);
  const handleSearchTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [search]
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const {
    data: items,
    isSuccess,
    error,
    isLoading,
  } = useGetCartQuery(undefined, { skip: !userDetails.user });
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  useEffect(() => {
    if (isSuccess && items) {
      dispatch(setCart(items.data));
    }
  }, [isSuccess, items, dispatch]);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log("User Logged out successfully!:", data);
      dispatch(setUser(null));
      router.push("/products");
      window.location.reload();
    },
    onError: (error) => {
      toast.error("Failed to logout" + error);
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(addSearchText(search));
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <nav className="bg-[#071108] shadow px-6 py-3 flex items-center justify-between">
      {isOpen && <ViewCartPopup onClose={() => setIsOpen(false)} />}
      {/* Logo */}
      <div
        className="text-xl font-bold text-[#C7DBE6] cursor-pointer"
        onClick={() => router.push("/products")}
      >
        Chelle's Store
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 w-full max-w-md">
        <SearchIcon className="text-[#C7DBE6]" />
        <BasicTextField
          id="find-text"
          value={search}
          handleChange={handleSearchTextChange}
          label=""
          className="w-full px-3 py-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#364652]"
          placeholder="Find something"
        />
      </div>
      <div className="flex justify-between gap-6">
        {/* Cart Icon Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative cursor-pointer"
        >
          <ShoppingCartOutlinedIcon className="text-[#C7DBE6] text-xl" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {cart.length}
            </span>
          )}
        </button>
        {/* User Avatar */}
        <div className="flex items-center gap-2">
          {userDetails.user ? (
            <>
              <div onClick={handleClick} className="cursor-pointer">
                <PersonIcon className="text-[#C7DBE6] text-xl" />
                <span className="text-sm text-[#C7DBE6]">
                  Hi, {userDetails.user?.firstName}
                </span>
              </div>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={() => router.push("/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleClose}>Orders</MenuItem>
                <MenuItem onClick={() => logoutMutation.mutate()}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <span
              className="cursor-pointer text-sm text-[#C7DBE6]"
              onClick={() => router.push("/login")}
            >
              Sign In
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
