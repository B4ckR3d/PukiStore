import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    // Match all routes except static files and API routes that need to be public
    "/((?!api/payment/callback|_next/static|_next/image|favicon.ico|sw.js|manifest.json|icons/.*).*)",
  ],
};
