import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";

/**
 * Auth.js configuration — edge-safe version (no Prisma adapter here).
 * This file is imported by middleware.ts which runs on the Edge runtime.
 */
export default {
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.hashedPassword) return null;

        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as Record<string, unknown>).role as string;
      }

      // For Google sign-in, check if user exists or create one
      if (account?.provider === "google" && token.email) {
        const existingUser = await db.user.findUnique({
          where: { email: token.email },
        });

        if (existingUser) {
          token.id = existingUser.id;
          token.role = existingUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isAdminRoute = nextUrl.pathname.startsWith("/dashboard/admin");
      const isSellerRoute = nextUrl.pathname.startsWith("/dashboard/seller");
      const isAuthRoute =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || nextUrl.origin;

      // Redirect logged-in users away from auth pages
      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", baseUrl));
      }

      // Protect dashboard routes
      if (isDashboard && !isLoggedIn) {
        return false; // Redirect to login
      }

      // Admin-only routes
      if (isAdminRoute && auth?.user?.role !== "ADMIN") {
        return Response.redirect(new URL("/dashboard", baseUrl));
      }

      // Seller-only routes
      if (
        isSellerRoute &&
        auth?.user?.role !== "SELLER" &&
        auth?.user?.role !== "ADMIN"
      ) {
        return Response.redirect(new URL("/dashboard", baseUrl));
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} satisfies NextAuthConfig;
