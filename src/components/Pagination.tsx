import Link from "next/link";

type PaginationProps = {
  page: number;
  pages: number;
  params: URLSearchParams;
};

export function Pagination({ page, pages, params }: PaginationProps) {
  if (pages <= 1) {
    return null;
  }

  const hrefFor = (targetPage: number) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("page", String(targetPage));
    return `/?${nextParams.toString()}#catalog`;
  };

  return (
    <nav className="flex items-center justify-center gap-3 pt-8">
      <Link
        href={hrefFor(Math.max(page - 1, 1))}
        aria-disabled={page === 1}
        className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white aria-disabled:pointer-events-none aria-disabled:opacity-35"
      >
        Previous
      </Link>
      <span className="text-sm text-white/45">
        Page {page} of {pages}
      </span>
      <Link
        href={hrefFor(Math.min(page + 1, pages))}
        aria-disabled={page === pages}
        className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white aria-disabled:pointer-events-none aria-disabled:opacity-35"
      >
        Next
      </Link>
    </nav>
  );
}
