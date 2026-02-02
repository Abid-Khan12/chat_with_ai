import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/auth/login", "/auth/sign-up"];

const PROTECTED_ROUTES = ["/chat"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  if (!token && PROTECTED_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (token && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
