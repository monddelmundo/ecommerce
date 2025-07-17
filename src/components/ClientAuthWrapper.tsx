"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../app/store/userSlice";

export default function ClientAuthWrapper() {
  const dispatch = useDispatch();
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me?populate=*`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (user) {
          dispatch(
            setUser({
              ...user,
              profilePhoto: `${process.env.NEXT_PUBLIC_UPLOADS_URL}${user.profilePhoto?.url}`,
            })
          );
          //   if (pathname === "/login") router.push("/products");
        }
      });
  }, [dispatch]);

  return null;
}
