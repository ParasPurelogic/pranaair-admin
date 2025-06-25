import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import getAdminInfo from './utils/server/getAdminInfo';
import { routes } from './config';

export async function middleware(request: NextRequest) {

    // Read the requested path name
    const pathName = request.nextUrl.pathname;

    // Authenticate user via access token cookie
    const adminInfo = await getAdminInfo();

    // Check if the requested path is a public path or not
    const isPublicPath = pathName.includes(routes.login.pathname);

    // If user is authenticated and accessing a public path and request does not have a "next-action" header, redirect to "home" page
    if (isPublicPath && adminInfo?.token) {
        return NextResponse.redirect(new URL(routes.home.url, request.url));
    }

    // If user is not authenticated and accessing a private path, redirect to "login" page
    if (!isPublicPath && !adminInfo?.token) {
        return NextResponse.redirect(new URL(routes.login.url, request.url));
    }
    // Have a response
    const response = NextResponse.next();

    // If no condition matches
    return response;
}

export const config = {
    matcher: '/((?!auth/oauth|scripts|_next/static|media|_next/image|favicon.ico|favicons|robots.txt|sw.*\\.js|workbox-.*\\.js|manifest.json).*)',
};
