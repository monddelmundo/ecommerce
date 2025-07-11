// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { Container, Typography, Paper } from "@mui/material";
import BasicTextField from "@/components/Textfield";
import Button from "@/components/Button";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authenticateUser } from "../api/auth";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();
  const dispatch = useDispatch();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const authMutation = useMutation({
    mutationFn: authenticateUser,
    onSuccess: (data) => {
      console.log("User Logged in successfully!:", data);
      dispatch(
        setUser({
          emailAddress: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          profilePhoto: data.user?.profilePhoto,
          documentId: data.user.documentId,
        })
      );
      router.push("/products");
    },
    onError: (error) => {
      toast.error("Invalid email/password!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    authMutation.mutate({ email: form.email, password: form.password });
  };

  return (
    <Container
      maxWidth="sm"
      className="flex items-center justify-center min-h-screen"
    >
      <Paper elevation={3} className="p-6 w-full">
        <Typography variant="h5" className="text-[#071108] mb-4">
          Login to Your Account
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <BasicTextField
            sx={{ marginTop: 2, marginBottom: 2 }}
            label="Email"
            name="email"
            value={form.email}
            handleChange={handleChange}
            fullWidth
            id="email-field"
            required
            type="email"
          />
          <BasicTextField
            label="Password"
            id="password-field"
            sx={{ marginBottom: 2 }}
            name="password"
            value={form.password}
            handleChange={handleChange}
            fullWidth
            required
            type="password"
          />
          {authMutation.isError && (
            <span className="text-red-500">Invalid username/password</span>
          )}
          <Button
            title="Login"
            isLoading={authMutation.isPending}
            type="submit"
          />
        </form>
      </Paper>
    </Container>
  );
}
