import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Добавляем значение 5 в опции
  const itemsPerPageOptions = [5, 10, 20, 30, 50, 100];

  return (
    <div className="pagination-container">
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft /> Назад
        </button>
        
        {startPage > 1 && (
          <>
            <button
              className={`pagination-page ${currentPage === 1 ? 'active' : ''}`}
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}
        
        {pageNumbers.map(page => (
          <button
            key={page}
            className={`pagination-page ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button
              className={`pagination-page ${currentPage === totalPages ? 'active' : ''}`}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          className="pagination-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Вперед <FaChevronRight />
        </button>
      </div>
      
      <div className="pagination-info">
        <span>Страница {currentPage} из {totalPages}</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="items-per-page-select"
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>
              {option} на странице
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;