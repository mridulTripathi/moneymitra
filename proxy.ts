import { NextRequest, NextResponse } from "next/server";
import { getLanguageForState } from "@/lib/i18n/languages";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  try {
    const existing = request.cookies.get("mm_suggested_locale");
    if (!existing) {
      // Vercel's edge network populates these headers with geolocation info
      // derived from the requester's IP. Not available in local dev — the
      // try/catch below ensures we simply skip setting the cookie there.
      const region =
        request.headers.get("x-vercel-ip-country-region") ||
        (request as unknown as { geo?: { region?: string } }).geo?.region ||
        null;

      if (region) {
        const languageCode = getLanguageForState(region);
        response.cookies.set("mm_suggested_locale", languageCode, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
          httpOnly: false,
        });
      }
    }
  } catch {
    // Geo data unavailable (e.g. local dev) — skip silently, no crash.
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all page routes, excluding:
     * - /api routes
     * - /_next (static/image optimization internals)
     * - static files (files with an extension, e.g. favicon.ico, images)
     */
    "/((?!api|_next/static|_next/image|.*\\..*).*)",
  ],
};
