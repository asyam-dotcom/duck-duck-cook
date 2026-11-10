import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

const JWT_SECRET = process.env.AUTH_SECRET || "duck-duck-cook-super-secret-jwt-key-2026";
const key = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isOrdersRoute = pathname.startsWith("/pesanan");

  if (!isDashboardRoute && !isAdminApiRoute && !isOrdersRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("ddc_session")?.value;

  if (!token) {
    if (isAdminApiRoute) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    const role = (payload as any).role;

    // Rute Pesanan Anda boleh diakses oleh user biasa maupun admin
    if (isOrdersRoute) {
      return NextResponse.next();
    }

    // Rute Dashboard & Admin API khusus role admin
    if (role !== "admin") {
      if (isAdminApiRoute) {
        return NextResponse.json(
          { success: false, error: "Forbidden: Akses khusus Administrator" },
          { status: 403 }
        );
      }
      // Pengguna non-admin dialihkan ke beranda
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("access_denied", "true");
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  } catch {
    if (isAdminApiRoute) {
      return NextResponse.json(
        { success: false, error: "Session kedaluwarsa. Silakan login ulang." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*", "/pesanan/:path*"],
};
