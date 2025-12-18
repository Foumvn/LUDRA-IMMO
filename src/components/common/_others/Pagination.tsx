'use client';

import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/common/ui/Button';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const ITEMS_PER_PAGE = 12;

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage = ITEMS_PER_PAGE,
  onPageChange,
  className = ''
}: PaginationProps) {
  const { t } = useTranslation();

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, 'ellipsis-start');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('ellipsis-end', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-between px-4 py-6 sm:px-6 ${className}`}>
      {/* Mobile: Info */}
      <div className="flex flex-1 justify-between items-center sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t('pagination.previous')}
        </Button>
        
        <span className="text-sm text-gray-700">
          {t('pagination.page_of', { current: currentPage, total: totalPages })}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium"
        >
          {t('pagination.next')}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Desktop: Pagination complète */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            {t('pagination.showing')}{' '}
            <span className="font-medium">
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
            </span>{' '}
            {t('pagination.to')}{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{' '}
            {t('pagination.of')}{' '}
            <span className="font-medium">{totalItems}</span>{' '}
            {t('pagination.results')}
          </p>
        </div>
        
        {/* AJOUT DU GAP ICI */}
        <nav className="isolate inline-flex gap-1 rounded-lg shadow-sm" aria-label="Pagination">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('pagination.previous')}
          </Button>

          {/* Page Numbers */}
          {visiblePages.map((page, index) => {
            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
              return (
                <span
                  key={index}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }

            const pageNumber = page as number;
            const isCurrent = pageNumber === currentPage;

            return (
              <Button
                key={index}
                variant={isCurrent ? "primary" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg ${
                  isCurrent 
                    ? 'z-10 bg-secondary text-white border-primary' 
                    : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </Button>
            );
          })}

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold"
          >
            {t('pagination.next')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </nav>
      </div>
    </div>
  );
}