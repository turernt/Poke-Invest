import { NextResponse, type NextRequest } from "next/server";

// Auth protection is handled client-side in each dashboard HTML file
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
