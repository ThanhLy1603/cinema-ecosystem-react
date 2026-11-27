import { CalendarClock, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ACTION_TONE_CLASSES } from '@/lib/common/buttonStyles';
import { cn } from '@/lib/common/utils';
import { getMovieDetailPath } from '@/lib/movie/moviePath';
import type { Movie } from '@/types/movie/movie';
import { ROW_ACTION_CLASSES } from '../utils/actionClasses';
import type { MovieListReturnState } from '../utils/listReturnPath';

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
      <div className="flex items-center justify-center gap-1.5">
         <Link
            to={`/admin/movies/${movie.id}`}
            state={movieListReturnState}
            aria-label={`Chỉnh sửa phim ${movie.title}`}
            title="Chỉnh sửa"
            className={cn(ROW_ACTION_CLASSES, ACTION_TONE_CLASSES.edit)}
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
               className={cn(ROW_ACTION_CLASSES, ACTION_TONE_CLASSES.view)}
            >
               <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
         )}
         <Link
            to="/admin/showtimes"
            aria-label="Suất chiếu"
            title="Suất chiếu"
            className={cn(ROW_ACTION_CLASSES, ACTION_TONE_CLASSES.schedule)}
         >
            <CalendarClock className="size-4" aria-hidden="true" />
         </Link>
         {canDelete && (
            <button
               type="button"
               onClick={() => onDelete(movie)}
               aria-label={`Xóa phim ${movie.title}`}
               title="Xóa"
               className={cn(ROW_ACTION_CLASSES, ACTION_TONE_CLASSES.remove)}
            >
               <Trash2 className="size-4" aria-hidden="true" />
            </button>
         )}
      </div>
   );
}

export default MovieRowActions;
