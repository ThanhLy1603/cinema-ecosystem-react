import { Plus, RotateCcw } from 'lucide-react';
import type { ReactElement } from 'react';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import EmptyPanel from './EmptyPanel';

interface MovieEmptyStateProps {
   isDeletedView: boolean;
   hasActiveFilters: boolean;
   onResetFilters: () => void;
}

export function MovieEmptyState({
   isDeletedView,
   hasActiveFilters,
   onResetFilters,
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
         <LinkButton to="/admin/movies/new" icon={<Plus className="size-4" aria-hidden="true" />}>
            Thêm phim
         </LinkButton>
      </EmptyPanel>
   );
}

export default MovieEmptyState;
