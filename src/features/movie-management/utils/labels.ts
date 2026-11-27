import { ADMIN_MOVIE_STATUSES, MOVIE_STATUS_LABELS } from '@/lib/movie/movieLabels';
import type { MovieStatus } from '@/types/movie/movie';

export interface MovieViewTab {
   key: string;
   label: string;
   status: MovieStatus | '';
   deleted: 'true' | '';
}

export const ACTIVE_MOVIE_VIEW_TABS: MovieViewTab[] = [
   { key: 'ALL', label: 'Tất cả', status: '', deleted: '' },
   ...ADMIN_MOVIE_STATUSES.map((movieStatus): MovieViewTab => ({
      key: movieStatus,
      label: MOVIE_STATUS_LABELS[movieStatus],
      status: movieStatus,
      deleted: '',
   })),
];

export const DELETED_MOVIE_VIEW_TAB: MovieViewTab = { key: 'DELETED', label: 'Đã xóa', status: '', deleted: 'true' };
