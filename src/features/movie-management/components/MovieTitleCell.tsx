import { Clapperboard } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import type { Movie } from '@/types/movie/movie';

interface MovieTitleCellProps {
   movie: Movie;
   onEdit: (movie: Movie) => void;
   children?: ReactNode;
}

export function MovieTitleCell({ movie, onEdit, children }: MovieTitleCellProps): ReactElement {
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
      <button
         type="button"
         onClick={() => onEdit(movie)}
         title={movie.title}
         className="group flex w-full items-center gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
      >
         {content}
      </button>
   );
}

export default MovieTitleCell;
