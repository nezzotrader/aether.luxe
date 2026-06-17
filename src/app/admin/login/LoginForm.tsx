"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: searchParams.get("callbackUrl") || "/admin",
    });

    setLoading(false);

    if (result?.error) {
      setMessage("Invalid admin email or password.");
      return;
    }

    router.push(result?.url || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <label className="block space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-white/45">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          className="h-12 w-full rounded-md border border-white/10 bg-[#111111] px-4 text-sm text-white outline-none focus:border-white/35"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-white/45">
          Password
        </span>
        <input
          name="password"
          type="password"
          required
          className="h-12 w-full rounded-md border border-white/10 bg-[#111111] px-4 text-sm text-white outline-none focus:border-white/35"
        />
      </label>
      {message ? <p className="text-sm text-red-300">{message}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-black transition hover:bg-[#d9d9d9] disabled:opacity-60"
      >
        <Lock className="size-4" aria-hidden="true" />
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
