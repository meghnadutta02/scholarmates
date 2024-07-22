import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req, res) {
    // const adminRoutes = [

    //   "/AdminRoute1",
    //   "/AdminRoute2",
    //   "/AdminRoute3",
    // ];

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
    "/api/:path*",
    "/find-people",
    "/chats",
    "/discussions/:path*",
    "/my-engagements",
    "/notification",
    "/profile/:path*",
    "/requests",
  ],
};
