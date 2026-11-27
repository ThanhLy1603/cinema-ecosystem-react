import { Clapperboard } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '@/types/movie/movie';
import type { MovieListReturnState } from '../utils/listReturnPath';

interface MovieTitleCellProps {
   movie: Movie;
   movieListReturnState: MovieListReturnState;
   children?: ReactNode;
}

export function MovieTitleCell({ movie, movieListReturnState, children }: MovieTitleCellProps): ReactElement {
   const content: ReactElement = (
      <>
         {movie.posterUrl ? (
            <img src={movie.posterUrl} alt="" className="h-14 w-10 shrink-0 rounded-md object-cover" />
         ) : (
            <span className="grid h-14 w-10 shrink-0 place-items-center rounded-md bg-ink-100 text-ink-300">
               <Clapperboard className="size-5" aria-hidden="true" />
            </span>
         )}
         <span className="min-w-0 md:min-w-36">
            <span className="line-clamp-2 break-words font-semibold text-ink-900 group-hover:text-brand-700">
               {movie.title}
            </span>
            {movie.originalTitle && (
               <span className="line-clamp-1 break-all text-xs text-ink-500">{movie.originalTitle}</span>
            )}
            {children}
         </span>
      </>
   );

   if (movie.deleted) {
      return <div className="flex items-center gap-3">{content}</div>;
   }
   return (
      <Link
         to={`/admin/movies/${movie.id}`}
         state={movieListReturnState}
         title={movie.title}
         className="group flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
      >
         {content}
      </Link>
   );
}

export default MovieTitleCell;
