"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../app/store/userSlice";

export default function ClientAuthWrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (user) dispatch(setUser(user));
      });
  }, [dispatch]);

  return null;
}
