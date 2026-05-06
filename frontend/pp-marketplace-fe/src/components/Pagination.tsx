interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;


  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Build page number list with ellipsis
  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - delta - 1 && i > 1) ||
        (i === currentPage + delta + 1 && i < totalPages)
      ) {
        pages.push('...');
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-3 mt-10">
      {/* Item count info */}
      <p className="text-sm text-gray-400">
        Showing{' '}
        <span className="text-white font-semibold">{startItem}–{endItem}</span>
        {' '}of{' '}
        <span className="text-white font-semibold">{totalItems}</span> items
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          id="pagination-prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded font-semibold text-sm transition-all ${
            currentPage === 1
              ? 'bg-dark-800 text-gray-600 cursor-not-allowed'
              : 'bg-dark-800 text-gray-300 hover:bg-gaming-red hover:text-white'
          }`}
          aria-label="Previous page"
        >
          ‹
        </button>

        {/* Page numbers */}
        {pages.map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500 text-sm select-none">
              …
            </span>
          ) : (
            <button
              key={page}
              id={`pagination-page-${page}`}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-2 rounded font-semibold text-sm transition-all min-w-[36px] ${
                currentPage === page
                  ? 'bg-gaming-red text-white shadow-[0_0_12px_rgba(255,23,68,0.5)]'
                  : 'bg-dark-800 text-gray-300 hover:bg-gaming-red hover:text-white'
              }`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          id="pagination-next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded font-semibold text-sm transition-all ${
            currentPage === totalPages
              ? 'bg-dark-800 text-gray-600 cursor-not-allowed'
              : 'bg-dark-800 text-gray-300 hover:bg-gaming-red hover:text-white'
          }`}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
