"use client";

import ErrorBoundary from "@/components/ReactBoundary";
import { RootState } from "../store";
import { useSelector } from "react-redux";

const CheckoutPage: React.FC = () => {
  const userDetails = useSelector((state: RootState) => state.user);
  return (
    <ErrorBoundary>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
              <h3 className="text-[#47a51f]">Delivery Address</h3>
              <p className="font-bold">{`${userDetails.user?.firstName} ${userDetails.user?.lastName}`}</p>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CheckoutPage;
