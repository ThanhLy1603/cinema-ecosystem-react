import { Plus, RotateCcw } from 'lucide-react';
import type { ReactElement } from 'react';
import Button from '@/components/ui/Button';
import EmptyPanel from './EmptyPanel';

interface MovieEmptyStateProps {
   isDeletedView: boolean;
   hasActiveFilters: boolean;
   onResetFilters: () => void;
   onCreateMovie: () => void;
}

export function MovieEmptyState({
   isDeletedView,
   hasActiveFilters,
   onResetFilters,
   onCreateMovie,
}: MovieEmptyStateProps): ReactElement {
   if (hasActiveFilters) {
      return (
         <EmptyPanel message="Không có phim nào phù hợp với bộ lọc.">
            <Button
               variant="secondary"
               icon={<RotateCcw className="size-4" aria-hidden="true" />}
               onClick={onResetFilters}
            >
               Xóa bộ lọc
            </Button>
         </EmptyPanel>
      );
   }
   if (isDeletedView) {
      return <EmptyPanel message="Chưa có phim nào trong thùng rác." />;
   }
   return (
      <EmptyPanel message="Chưa có phim nào trong hệ thống.">
         <Button icon={<Plus className="size-4" aria-hidden="true" />} onClick={onCreateMovie}>
            Thêm phim
         </Button>
      </EmptyPanel>
   );
}

export default MovieEmptyState;
