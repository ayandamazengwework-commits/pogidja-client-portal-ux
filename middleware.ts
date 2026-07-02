import { NextResponse, type NextRequest } from 'next/server'

// Prototype mode: authentication is mocked on the client so the entire
// application is freely navigable for demonstration purposes. The middleware
// only redirects the bare root to the login screen.
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
