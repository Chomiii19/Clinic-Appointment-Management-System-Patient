import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
}: PaginationProps) {
  const safeCurrentPage = Number(currentPage) || 1;
  const safePerPage = Number(perPage) || 10;
  const safeTotal = Number(totalItems) || 0;

  const start = safeTotal > 0 ? (safeCurrentPage - 1) * safePerPage + 1 : 0;
  const end = Math.min(safeCurrentPage * safePerPage, safeTotal);

  const handlePrev = () => {
    if (safeCurrentPage > 1) onPageChange(safeCurrentPage - 1);
  };
  const handleNext = () => {
    if (safeCurrentPage < totalPages) onPageChange(safeCurrentPage + 1);
  };

  const renderPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - safeCurrentPage) <= 1) {
        pages.push(i);
      } else if (
        (i === 2 && safeCurrentPage > 3) ||
        (i === totalPages - 1 && safeCurrentPage < totalPages - 2)
      ) {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <footer className="flex items-center justify-between border-t border-zinc-300 dark:border-zinc-700 px-4 pt-3 mb-2 sm:px-6 sticky bottom-0 bg-system-white dark:bg-system-black">
      {/* Mobile */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrev}
          disabled={safeCurrentPage === 1}
          className="relative inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={safeCurrentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-800 dark:text-zinc-200">
            Showing <span className="font-medium">{start}</span> to{" "}
            <span className="font-medium">{end}</span> of{" "}
            <span className="font-medium">{safeTotal}</span> results
          </p>
        </div>

        <nav
          aria-label="Pagination"
          className="isolate inline-flex -space-x-px rounded-md"
        >
          <button
            onClick={handlePrev}
            disabled={safeCurrentPage === 1}
            className="relative inline-flex items-center rounded-l-md border border-zinc-300 dark:border-zinc-700 px-2 py-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {renderPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold border border-zinc-300 dark:border-zinc-700 cursor-pointer ${
                  page === safeCurrentPage
                    ? "bg-blue-600 text-white z-10"
                    : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={handleNext}
            disabled={safeCurrentPage === totalPages}
            className="relative inline-flex items-center rounded-r-md border border-zinc-300 dark:border-zinc-700 px-2 py-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </footer>
  );
}
