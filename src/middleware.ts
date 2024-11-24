import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 현재 URL과 환경 확인
  const { pathname, origin } = request.nextUrl;
  console.log('Current pathname:', pathname);
  console.log('Current origin:', origin);

  // 인증 상태 확인 (여러 쿠키 확인)
  const isAuthenticated = request.cookies.has('auth') || 
                         request.cookies.has('authToken') || 
                         request.cookies.has('token');
  
  console.log('Authentication status:', isAuthenticated);

  // 보호된 라우트에 대한 접근 제어
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      console.log('Unauthorized access attempt to dashboard, redirecting to login');
      const loginUrl = new URL('/login', origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 로그인한 사용자의 로그인/회원가입 페이지 접근 제어
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (isAuthenticated) {
      console.log('Authenticated user attempting to access login/register, redirecting to dashboard');
      const dashboardUrl = new URL('/dashboard', origin);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 응답 헤더 설정
  const response = NextResponse.next();
  
  // 보안 헤더 추가
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    '/dashboard/:path*',
    '/login',
    '/register'
  ],
};