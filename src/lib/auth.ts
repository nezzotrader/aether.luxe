import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPasswordHash) {
          throw new Error("Admin credentials are not configured.");
        }

        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password || "";
        const isEmailValid = email === adminEmail.trim().toLowerCase();
        const isPasswordValid = password === adminPassword;

        if (!isEmailValid || !isPasswordValid) {
          return null;
        }

        return {
          id: "aether-luxe-admin",
          email: adminEmail,
          name: "Aether Luxe Admin",
        };
      },
    }),
  ],
};
