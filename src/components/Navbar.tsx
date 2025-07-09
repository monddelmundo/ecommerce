"use client";

import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import BasicTextField from "./Textfield";
import { useDispatch, useSelector } from "react-redux";
import { addSearchText } from "@/app/store/productSlice";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ViewCartPopup from "./ViewCartPopup";
import { RootState } from "@/app/store";
import { Menu, MenuItem } from "@mui/material";

const Navbar: React.FC = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <div className="text-xl font-bold text-[#C7DBE6]">Chelle's Store</div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 w-full max-w-md">
        <SearchIcon className="text-[#C7DBE6]" />
        <BasicTextField
          id="find-text"
          value={search}
          handleChange={(e) => handleSearchTextChange(e)}
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
          <div onClick={handleClick}>
            <PersonIcon className="text-[#C7DBE6] text-xl" />
            <span className="text-sm text-[#C7DBE6]">Hi, Edmond</span>
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Orders</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
