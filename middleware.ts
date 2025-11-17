import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Si el usuario está logueado y está en la página principal, redirigir a dashboard
    if (token && path === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Permitir acceso a la página principal si no está logueado
        if (path === '/' && !token) {
          return true;
        }

        // Para rutas de dashboard, requerir autenticación
        if (path.startsWith('/dashboard')) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
