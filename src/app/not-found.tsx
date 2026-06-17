import Link from "next/link";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/45">
          Not found
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-white">
          This catalog piece is unavailable.
        </h1>
        <Link
          href="/#catalog"
          className="mt-8 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#d9d9d9]"
        >
          Return to catalog
        </Link>
      </main>
    </>
  );
}
