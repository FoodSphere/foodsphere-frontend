// middleware.ts (วางไว้ root หรือ src/)
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { EPermission, EUserType, PAGE_CORE_PERMISSIONS } from "./types/enum";

interface DecodedToken {
  user_type: string;
  permissions: number[] | null;
}

// Decode JWT payload without verification (Edge Runtime compatible)
function decodeJwt(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as DecodedToken;
  } catch {
    return null;
  }
}

function getRequiredPermissions(pathname: string): number[] | null {
  if (pathname === "/") {
    return [EPermission.DASHBOARD];
  }

  for (const [route, permissions] of Object.entries(PAGE_CORE_PERMISSIONS)) {
    if (route !== "/" && (pathname === route || pathname.startsWith(route + "/"))) {
      return permissions;
    }
  }

  return null;
}

export function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const token = request.cookies.get("access_token")?.value;

  if (!token && pathName !== "/login" && !pathName.startsWith("/worker-portal")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && pathName === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token) {
    const decodedToken = decodeJwt(token);

    if (decodedToken?.user_type === EUserType.WORKER) {
      const requiredPermissions = getRequiredPermissions(pathName);

      if (
        requiredPermissions !== null &&
        !requiredPermissions.some((id) => decodedToken.permissions?.includes(id))
      ) {
        if (pathName !== "/forbidden") {
          return NextResponse.redirect(new URL("/forbidden", request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

// กำหนด path ที่จะให้ middleware ทำงาน
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
