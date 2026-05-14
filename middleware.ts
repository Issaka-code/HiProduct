import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protection des routes du dashboard
  const isAuthPage = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup'
  const isDashboardPage = req.nextUrl.pathname !== '/' && !isAuthPage && !req.nextUrl.pathname.startsWith('/api') && !req.nextUrl.pathname.startsWith('/auth')

  if (!session && isDashboardPage) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (session && isAuthPage) {
    const url = req.nextUrl.clone()
    url.pathname = '/explorer'
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth).*)'],
}
