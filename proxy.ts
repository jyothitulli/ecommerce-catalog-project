// proxy.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(req: NextRequest) {
  return withAuth(
    function middleware(req: NextRequest) {
      return NextResponse.next()
    },
    {
      callbacks: {
        authorized: ({ token }) => !!token
      },
    }
  )(req)
}

export const config = {
  matcher: ['/cart', '/cart/:path*']
}