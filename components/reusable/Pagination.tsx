import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationCategoryProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  count: number;
  limit: number;
}

const PaginationCategory: React.FC<PaginationCategoryProps> = ({
  currentPage,
  setCurrentPage,
  count,
  limit,
}) => {
  const totalPages = Math.ceil(count / limit);

  const scrollToTop = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight / 4,
      behavior: "smooth",
    });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => {
        const newPage = prevPage + 1;
        scrollToTop();
        return newPage;
      });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => {
        const newPage = prevPage - 1;
        scrollToTop();
        return newPage;
      });
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const renderPaginationItems = () => {
    if (totalPages <= 4) {
      // Show all pages if totalPages is 3 or 4
      return [...Array(totalPages)].map((_, i) => {
        const pageIndex = i + 1;
        return (
          <PaginationItem
            key={pageIndex}
            className={
              currentPage === pageIndex
                ? "bg-devinovGreen text-white rounded-md cursor-pointer"
                : "cursor-pointer"
            }
          >
            <PaginationLink onClick={() => handlePageClick(pageIndex)}>
              {pageIndex}
            </PaginationLink>
          </PaginationItem>
        );
      });
    }

    // Show ellipsis if totalPages > 4
    return (
      <>
        <PaginationItem
          className={
            currentPage === 1
              ? "bg-devinovGreen text-white rounded-md cursor-pointer"
              : "cursor-pointer"
          }
        >
          <PaginationLink onClick={() => handlePageClick(1)}>1</PaginationLink>
        </PaginationItem>
        <PaginationItem
          className={
            currentPage === 2
              ? "bg-devinovGreen text-white rounded-md cursor-pointer"
              : "cursor-pointer"
          }
        >
          <PaginationLink onClick={() => handlePageClick(2)}>2</PaginationLink>
        </PaginationItem>
        {currentPage > 3 && totalPages > 4 && (
          <PaginationItem className="cursor-pointer">
            <span>...</span>
          </PaginationItem>
        )}
        {currentPage > 2 && currentPage < totalPages - 1 && (
          <PaginationItem
            className={
              "bg-devinovGreen text-white rounded-md cursor-pointer"
            }
          >
            <PaginationLink onClick={() => handlePageClick(currentPage)}>
              {currentPage}
            </PaginationLink>
          </PaginationItem>
        )}
        {currentPage < totalPages - 2 && (
          <PaginationItem className="cursor-pointer">
            <span>...</span>
          </PaginationItem>
        )}
        <PaginationItem
          className={
            currentPage === totalPages
              ? "bg-devinovGreen text-white rounded-md cursor-pointer"
              : "cursor-pointer"
          }
        >
          <PaginationLink onClick={() => handlePageClick(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      </>
    );
  };

  return (
    <Pagination>
      <PaginationContent>
        {currentPage !== 1 && (
          <PaginationItem>
            <PaginationPrevious className="cursor-pointer" onClick={prevPage} />
          </PaginationItem>
        )}

        {renderPaginationItems()}

        {currentPage !== totalPages && (
          <PaginationItem>
            <PaginationNext className="cursor-pointer" onClick={nextPage} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationCategory;
