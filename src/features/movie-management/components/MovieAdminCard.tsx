import type { ReactElement, ReactNode } from 'react';
import AgeRatingBadge from '@/components/common/AgeRatingBadge';
import { formatDuration, formatReleaseDate } from '@/lib/movie/movieFormat';
import type { Movie } from '@/types/movie/movie';
import MovieGenreBadges from './MovieGenreBadges';
import MovieStatusBadge from './MovieStatusBadge';
import MovieTitleCell from './MovieTitleCell';

interface MovieAdminCardProps {
   movie: Movie;
   onEdit: (movie: Movie) => void;
   children: ReactNode;
   selection?: ReactNode;
}

export function MovieAdminCard({ movie, onEdit, children, selection }: MovieAdminCardProps): ReactElement {
   return (
      <li className="space-y-3 rounded-xl bg-white p-3 text-sm shadow-card ring-1 ring-ink-200/80">
         <div className="flex items-center gap-2">
            {selection}
            <div className="min-w-0 flex-1">
               <MovieTitleCell movie={movie} onEdit={onEdit} />
            </div>
         </div>
         <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-ink-700">
            <AgeRatingBadge ageRating={movie.rated} />
            <span>{formatDuration(movie.durationMinutes)}</span>
            <span>Khởi chiếu {formatReleaseDate(movie.releaseDate)}</span>
            <MovieStatusBadge movieStatus={movie.status} isDeleted={movie.deleted} />
         </div>
         <MovieGenreBadges genres={movie.genres} maxVisible={movie.genres.length} />
         <div className="flex justify-end border-t border-ink-100 pt-2">{children}</div>
      </li>
   );
}

export default MovieAdminCard;
