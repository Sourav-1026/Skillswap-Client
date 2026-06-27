import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.session?.token) {
    return NextResponse.json({ token: null }, { status: 401 });
  }

  return NextResponse.json({ token: session.session.token });
}
