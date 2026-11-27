import { CalendarClock, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/common/utils';
import { getMovieDetailPath } from '@/lib/movie/moviePath';
import type { Movie } from '@/types/movie/movie';
import type { MovieListReturnState } from '../utils/listReturnPath';

const ACTION_CLASSES: string =
   'grid size-10 shrink-0 md:size-8 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200';

interface MovieRowActionsProps {
   movie: Movie;
   movieListReturnState: MovieListReturnState;
   canDelete: boolean;
   onDelete: (movie: Movie) => void;
}

export function MovieRowActions({
   movie,
   movieListReturnState,
   canDelete,
   onDelete,
}: MovieRowActionsProps): ReactElement {
   return (
      <div className="flex items-center justify-end gap-1">
         <Link
            to={`/admin/movies/${movie.id}`}
            state={movieListReturnState}
            aria-label={`Chỉnh sửa phim ${movie.title}`}
            title="Chỉnh sửa"
            className={ACTION_CLASSES}
         >
            <Pencil className="size-4" aria-hidden="true" />
         </Link>
         {movie.slug && (
            <Link
               to={getMovieDetailPath(movie.slug)}
               target="_blank"
               rel="noopener noreferrer"
               aria-label={`Xem trang khách hàng của phim ${movie.title}, mở tab mới`}
               title="Xem trang khách hàng"
               className={ACTION_CLASSES}
            >
               <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
         )}
         <Link to="/admin/showtimes" aria-label="Suất chiếu" title="Suất chiếu" className={ACTION_CLASSES}>
            <CalendarClock className="size-4" aria-hidden="true" />
         </Link>
         {canDelete && (
            <button
               type="button"
               onClick={() => onDelete(movie)}
               aria-label={`Xóa phim ${movie.title}`}
               title="Xóa"
               className={cn(ACTION_CLASSES, 'hover:bg-danger-50 hover:text-danger-700')}
            >
               <Trash2 className="size-4" aria-hidden="true" />
            </button>
         )}
      </div>
   );
}

export default MovieRowActions;
