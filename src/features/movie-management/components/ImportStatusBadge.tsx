import type { ReactElement } from 'react';
import { cn } from '@/lib/common/utils';
import type { ImportRowStatus } from '@/types/movie/movieImport';

interface ImportStatusBadgeProps {
   importRowStatus: ImportRowStatus;
}

const ROW_STATUS_LABELS: Record<ImportRowStatus, string> = {
   VALID: 'Hợp lệ',
   CREATED: 'Đã tạo',
   DUPLICATE: 'Trùng, bỏ qua',
   ERROR: 'Lỗi',
};

const ROW_STATUS_CLASSES: Record<ImportRowStatus, string> = {
   VALID: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
   CREATED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
   DUPLICATE: 'bg-amber-50 text-ink-800 ring-amber-200',
   ERROR: 'bg-danger-50 text-danger-700 ring-danger-200',
};

export function ImportStatusBadge({ importRowStatus }: ImportStatusBadgeProps): ReactElement {
   return (
      <span
         className={cn(
            'inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1',
            ROW_STATUS_CLASSES[importRowStatus],
         )}
      >
         {ROW_STATUS_LABELS[importRowStatus]}
      </span>
   );
}

export default ImportStatusBadge;
