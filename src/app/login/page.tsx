// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { Container, Typography, Paper } from "@mui/material";
import BasicTextField from "@/components/Textfield";
import Button from "@/components/Button";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();
  const dispatch = useDispatch();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", form);
    dispatch(
      setUser({
        emailAddress: "test@gmail.com",
        firstName: "Harry",
        lastName: "Potter",
        profilePhoto: "",
      })
    );
    router.push("/products");

    // Add auth logic here
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
          <Button title="Login" type="submit" />
        </form>
      </Paper>
    </Container>
  );
}
