"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  currentItemsCount: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  currentItemsCount,
  loading = false,
  onPageChange,
}: PaginationProps) {
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;
  
  if (totalPages <= 1) return null;
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-between bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-lg z-50 min-w-[320px]">
      <div className="text-sm text-neutral-500 whitespace-nowrap">
        {currentItemsCount} of {totalCount}
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev || loading}
          className="flex items-center h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-neutral-500 font-medium min-w-[60px] text-center">
          {currentPage} / {totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext || loading}
          className="flex items-center h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}