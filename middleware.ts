import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized: function ({ token }) {
      return !!token;
    },
  },
});

export function middleware(request: NextRequest) {
  // Clone the request headers and set a new header `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  // You can also set request headers in NextResponse.rewrite
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });

  // Set a new response header `x-hello-from-middleware2`
  // response.headers.set("x-hello-from-middleware2", "hello");
  return response;
}

export const config = {
  matcher: ["/dashboard", "/matches/:path*"],
};
