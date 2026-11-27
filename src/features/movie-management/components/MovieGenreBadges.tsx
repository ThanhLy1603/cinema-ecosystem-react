import type { ReactElement } from 'react';
import type { Genre } from '@/types/movie/movie';

const DEFAULT_MAX_VISIBLE_GENRES: number = 2;
const BADGE_CLASSES: string = 'whitespace-nowrap rounded-md bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-700';

interface MovieGenreBadgesProps {
   genres: Genre[];
   maxVisible?: number;
}

export function MovieGenreBadges({
   genres,
   maxVisible = DEFAULT_MAX_VISIBLE_GENRES,
}: MovieGenreBadgesProps): ReactElement | null {
   if (genres.length === 0) {
      return null;
   }

   const visibleGenres: Genre[] = genres.slice(0, maxVisible);
   const hiddenGenres: Genre[] = genres.slice(maxVisible);

   return (
      <div className="flex flex-wrap items-center gap-1">
         {visibleGenres.map((genre) => (
            <span key={genre.id} className={BADGE_CLASSES}>
               {genre.name}
            </span>
         ))}
         {hiddenGenres.length > 0 && (
            <span title={genres.map((genre) => genre.name).join(', ')} className={`${BADGE_CLASSES} cursor-help`}>
               +{hiddenGenres.length}
               <span className="sr-only">: {hiddenGenres.map((genre) => genre.name).join(', ')}</span>
            </span>
         )}
      </div>
   );
}

export default MovieGenreBadges;
