export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-3 w-28 rounded-full bg-white/10" />
      <div className="mt-5 h-12 w-56 rounded-md bg-white/10" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-white/10 bg-[#120407]"
          >
            <div className="aspect-square animate-pulse bg-white/10" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-24 rounded-full bg-white/10" />
              <div className="h-5 w-4/5 rounded-full bg-white/10" />
              <div className="h-4 w-20 rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
