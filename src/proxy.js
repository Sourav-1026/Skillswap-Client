import { NextResponse } from "next/server";

export async function proxy(request) {
  const sessionCookie =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const response = await fetch(
      `${request.nextUrl.origin}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    );

    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const session = await response.json();
    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRole = session.user.role?.toLowerCase();
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith("/dashboard/client") && userRole !== "client") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (
      pathname.startsWith("/dashboard/freelancer") &&
      userRole !== "freelancer"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
