// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwtToken")?.value; // Adjust cookie name if needed

  const isAuthenticated = !!token;
  const protectedPaths = ["/login", "/register"]; // Routes to protect from authenticated users

  const protectedForUnauthenticated = ["/checkout", "/payment", "/profile"];

  if (isAuthenticated && protectedPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  if (
    !isAuthenticated &&
    protectedForUnauthenticated.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply only to the routes we want to check
export const config = {
  matcher: ["/login", "/register", "/checkout", "/payment", "/profile"],
};
