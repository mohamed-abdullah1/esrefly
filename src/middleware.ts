// import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { COOKIES_KEYS } from "./lib/enums";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if cookie exists
  const userId = req.cookies.get(COOKIES_KEYS.ESREFLY_USER_ID)?.value;

  const isAuthPage = req.nextUrl.pathname === "/auth";

  if (!userId) {
    // No cookies, but trying to access auth page - allow it
    if (isAuthPage) {
      return NextResponse.next();
    }
    // No cookies and trying to access protected route - redirect to auth
    return NextResponse.redirect(new URL("/auth", req.url));
  }
  if (userId) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/chat/:path*", "/auth"],
};
