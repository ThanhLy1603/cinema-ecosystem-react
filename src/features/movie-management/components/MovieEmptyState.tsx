import { Plus, RotateCcw } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';

interface MovieEmptyStateProps {
   isDeletedView: boolean;
   hasActiveFilters: boolean;
   onResetFilters: () => void;
}

function renderPanel(message: string, action?: ReactNode): ReactElement {
   return (
      <div className="space-y-4 rounded-3xl bg-white px-4 py-10 text-center shadow-card ring-1 ring-ink-200/80">
         <p className="text-sm text-ink-500">{message}</p>
         {action}
      </div>
   );
}

export function MovieEmptyState({
   isDeletedView,
   hasActiveFilters,
   onResetFilters,
}: MovieEmptyStateProps): ReactElement {
   if (hasActiveFilters) {
      return renderPanel(
         'Không có phim nào phù hợp với bộ lọc.',
         <Button
            variant="secondary"
            icon={<RotateCcw className="size-4" aria-hidden="true" />}
            onClick={onResetFilters}
         >
            Xóa bộ lọc
         </Button>,
      );
   }
   if (isDeletedView) {
      return renderPanel('Chưa có phim nào trong thùng rác.');
   }
   return renderPanel(
      'Chưa có phim nào trong hệ thống.',
      <LinkButton to="/admin/movies/new" icon={<Plus className="size-4" aria-hidden="true" />}>
         Thêm phim
      </LinkButton>,
   );
}

export default MovieEmptyState;
