import { Suspense } from "react";
import { Header } from "@/components/Header";
import { LoginForm } from "./LoginForm";

export default function AdminLogin() {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-white/45">
          Admin access
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-white">
          Private catalog management.
        </h1>
        <p className="mt-4 text-sm leading-6 text-white/55">
          Sign in to add, edit, upload, and remove products from the catalog.
        </p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}
