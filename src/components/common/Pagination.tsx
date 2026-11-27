import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactElement } from 'react';
import Button from '@/components/ui/Button';

interface PaginationProps {
   page: number;
   totalPages: number;
   totalElements: number;
   onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, totalElements, onPageChange }: PaginationProps): ReactElement | null {
   const lastPage: number = Math.max(totalPages - 1, 0);

   if (totalElements === 0) {
      return null;
   }

   return (
      <nav
         aria-label="Phân trang"
         className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-600 in-[.theme-console]:rounded-2xl in-[.theme-console]:border in-[.theme-console]:border-ink-200 in-[.theme-console]:bg-white in-[.theme-console]:px-4 in-[.theme-console]:py-3 in-[.theme-console]:shadow-card"
      >
         <p>
            Trang <strong className="text-ink-900">{page + 1}</strong> / {Math.max(totalPages, 1)} ·{' '}
            {totalElements.toLocaleString('vi-VN')} kết quả
         </p>
         <div className="flex gap-2">
            <Button
               variant="secondary"
               size="sm"
               icon={<ChevronLeft className="size-4" aria-hidden="true" />}
               disabled={page <= 0}
               onClick={() => onPageChange(page - 1)}
            >
               Trước
            </Button>
            <Button
               variant="secondary"
               size="sm"
               disabled={page >= lastPage}
               onClick={() => onPageChange(page + 1)}
               icon={<ChevronRight className="size-4" aria-hidden="true" />}
            >
               Sau
            </Button>
         </div>
      </nav>
   );
}

export default Pagination;
