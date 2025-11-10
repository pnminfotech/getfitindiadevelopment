import React from "react";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumber = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };
  const handleClick = (page) => {
    if (page === "...") {
      return;
    }
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
  };

  return (
   <div className="flex flex-wrap justify-center gap-2 sm:gap-4 my-6 sm:my-10 px-2">
  {/* Previous Button */}
  <button
    className="min-w-[100px] px-4 py-2 rounded-lg bg-gray-700 text-white text-base sm:text-lg font-semibold hover:bg-gray-400 hover:text-black shadow transition"
    onClick={() => handleClick(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Previous
  </button>

  {/* Page Numbers */}
  <div className="flex flex-wrap justify-center gap-2">
    {getPageNumber().map((page, idx) => (
      <button
        key={idx}
        onClick={() => handleClick(page)}
        className={`min-w-[40px] px-3 py-2 rounded-lg text-sm sm:text-base font-medium transition ${
          page === currentPage
            ? "bg-cyan-600 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        } ${page === "..." ? "cursor-default opacity-70" : ""}`}
        disabled={page === "..."}
      >
        {page}
      </button>
    ))}
  </div>

  {/* Next Button */}
  <button
    className="min-w-[100px] px-4 py-2 rounded-lg bg-gray-700 text-white text-base sm:text-lg font-semibold hover:bg-gray-400 hover:text-black shadow transition"
    onClick={() => handleClick(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>

  );
};

export default Pagination;
