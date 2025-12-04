import React, { useState } from "react";

const EventPagination = ({ totalRecords, rows = 15, onPageChange, current  }) => {
  const [currentPage, setCurrentPage] = useState(current);
  const totalPages = Math.ceil(totalRecords / rows);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5; // Maximum visible page numbers
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Show first, last, and pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      visiblePages.push(1); // Always show first page
      
      if (start > 2) {
        visiblePages.push('...'); // Ellipsis for skipped pages
      }
      
      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }
      
      if (end < totalPages - 1) {
        visiblePages.push('...'); 
      }
      
      visiblePages.push(totalPages); 
    }
    
    return visiblePages;
  };

  return (
    totalRecords > rows && (
      <div className="flex justify-center my-8">
        <div className="flex flex-wrap gap-1 sm:gap-2 justify-center items-center">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-200 disabled:opacity-50 disabled:hover:bg-white transition-colors duration-200 text-sm sm:text-base flex items-center gap-1 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          {/* Page Numbers */}
          {getVisiblePages().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">...</span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base transition-colors duration-200 ${
                  currentPage === page 
                    ? 'bg-amber-500 text-white border border-amber-500 shadow-sm' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-200'
                }`}
              >
                {page}
              </button>
            )
          ))}
          
          {/* Next Button */}
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-200 disabled:opacity-50 disabled:hover:bg-white transition-colors duration-200 text-sm sm:text-base flex items-center gap-1 shadow-sm"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    )
  );
};

export default EventPagination;