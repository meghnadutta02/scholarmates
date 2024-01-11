import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("middleware", req.nextUrl.pathname);
    console.log("middleware", req.nextauth.token);

    const adminRoutes = [
      "/CreateUser",
      "/AdminRoute1",
      "/AdminRoute2",
      "/AdminRoute3",
    ];

    if (
      adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) &&
      req.nextauth.token.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/CreateUser",
    "/AdminRoute1",
    "/api/users/profile",
    "/AdminRoute2",
    "/AdminRoute3",
    "/posts",
    "/reels",
  ],
};
