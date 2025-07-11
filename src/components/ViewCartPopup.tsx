import { useEffect } from "react";
import { CartProduct } from "@/app/products/page";
import { IconButton } from "@mui/material";
import { useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Button from "./Button";
import {
  addQty,
  checkUncheck,
  checkUncheckAll,
  setCart,
  subtractQty,
} from "@/app/store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Checkbox from "./Checkbox";

interface Props {
  onClose: () => void;
}

const SUBTRACT = "SUBTRACT";
const ADD = "ADD";

const ViewCartPopup: React.FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [selectAll, setSelectAll] = useState(false);
  const total = cartItems.reduce(
    (sum, item) =>
      sum + (item.isChecked ? item.product.price * item.quantity : 0),
    0
  );

  useEffect(() => {
    setSelectAll(cartItems.every((item) => item.isChecked));
  }, [cartItems]);

  const handleQty = (productId: number, operation: string) => {
    dispatch(operation === ADD ? addQty(productId) : subtractQty(productId));
    // @TODO: Update cart item
  };

  const handleCheckboxCartChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    dispatch(checkUncheck({ id, isChecked: e.target.checked }));
  };

  const handleCheckboxAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(checkUncheckAll(e.target.checked));
    setSelectAll(e.target.checked);
  };

  const handleCheckout = () => {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="">Your cart is empty.</p>
        ) : (
          <ul className="space-y-4 max-h-60 overflow-y-auto">
            {cartItems.map((item) => (
              <li
                key={item.product.id}
                className="flex items-center justify-between"
              >
                <Checkbox
                  checked={item.isChecked}
                  handleChange={(e) =>
                    handleCheckboxCartChange(e, item.product.id)
                  }
                />
                <img
                  src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}${item.product.image.url}`}
                  alt={item.product.title}
                  className="w-12 h-12 object-contain rounded"
                />
                <div className="flex-1  ml-4">
                  <p className="font-medium">{item.product.title}</p>
                  <div className="flex justify-between">
                    <p className="text-sm ">${item.product.price.toFixed(2)}</p>
                    <div>
                      <IconButton
                        onClick={() => handleQty(item.product.id, SUBTRACT)}
                        aria-label="delete"
                        size="small"
                      >
                        <RemoveIcon
                          className="text-[#B5BEC6]"
                          fontSize="inherit"
                        />
                      </IconButton>
                      {item.quantity}
                      <IconButton
                        onClick={() => handleQty(item.product.id, ADD)}
                        aria-label="add"
                        size="small"
                      >
                        <AddIcon
                          className="text-[#B5BEC6]"
                          fontSize="inherit"
                        />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Checkbox
          title="Select All"
          checked={selectAll}
          handleChange={(e) => handleCheckboxAllChange(e)}
        />
        <div className="mt-4">
          <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
          <Button onClick={handleCheckout} title="Proceed to Checkout" />
        </div>

        <Button
          className="cursor-pointer mt-4 bg-white text-[#071108] px-4 py-2 rounded hover:bg-[#B5BEC6]"
          onClick={onClose}
          title="Close"
        />
      </div>
    </div>
  );
};

export default ViewCartPopup;
