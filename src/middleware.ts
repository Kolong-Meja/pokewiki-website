import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const locale = request.nextUrl.locale;
  const cachedLocale = request.cookies.get("locale")?.value;

  if (!cachedLocale || locale === cachedLocale) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.locale = cachedLocale;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|static).*)"],
};
