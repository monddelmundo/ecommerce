"use client";

import ErrorBoundary from "@/components/ReactBoundary";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import Button from "@/components/Button";
import Avatar from "@/components/Avatar";
import FileUpload from "@/components/FileUpload";

const CheckoutPage: React.FC = () => {
  const userDetails = useSelector((state: RootState) => state.user);
  return (
    <ErrorBoundary>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Profile</h2>
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="mx-auto">
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    <Typography>Username</Typography>
                    <p className="font-bold">{userDetails.user?.username}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    <Typography>First Name</Typography>
                    <p className="font-bold">{userDetails.user?.firstName}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    <Typography>Last Name</Typography>
                    <p className="font-bold">{userDetails.user?.lastName}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    <Typography>Email Address</Typography>
                    <p className="font-bold">{userDetails.user?.email}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    <Typography>Date of Birth</Typography>
                    <p className="font-bold">{userDetails.user?.dateOfBirth}</p>
                  </div>
                </div>
                <div className="justify-items-center-safe">
                  <Avatar
                    alt={userDetails.user?.firstName ?? "Profile"}
                    src={userDetails.user?.profilePhoto ?? ""}
                    sx={{ width: 60, height: 60 }}
                  />
                  <FileUpload handleChange={() => {}} label="Upload Image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CheckoutPage;
