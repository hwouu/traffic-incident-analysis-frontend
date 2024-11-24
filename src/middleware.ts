import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  console.log('Middleware executing for path:', pathname);

  // 모든 쿠키 상태 로깅
  const allCookies = request.cookies.getAll();
  console.log('Available cookies:', allCookies);

  // 인증 상태 확인 - auth 쿠키만 체크하도록 변경
  const authToken = request.cookies.get('auth');
  const isAuthenticated = !!authToken;

  console.log('Auth token present:', !!authToken);
  console.log('Is authenticated:', isAuthenticated);

  // 대시보드 접근 제어
  if (pathname.includes('/dashboard')) {
    if (!isAuthenticated) {
      console.log('Blocking unauthorized dashboard access');
      const loginUrl = new URL('/login', origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 인증된 사용자의 로그인/회원가입 페이지 접근 제어
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (isAuthenticated) {
      console.log('Redirecting authenticated user from auth pages');
      const dashboardUrl = new URL('/dashboard', origin);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 명확한 경로 매칭
    '/dashboard',
    '/dashboard/:path*',
    '/login',
    '/register'
  ]
};