import { useState, type ReactElement } from 'react';
import { useLocation, type Location } from 'react-router-dom';
import AgeRatingBadge from '@/components/common/AgeRatingBadge';
import { formatDuration, formatReleaseDate } from '@/lib/movie/movieFormat';
import type { Movie } from '@/types/movie/movie';
import type { MovieListReturnState } from '../utils/listReturnPath';
import DeleteMovieDialog from './DeleteMovieDialog';
import MovieActions from './MovieActions';
import MovieAdminCard from './MovieAdminCard';
import MovieEmptyState from './MovieEmptyState';
import MovieGenreBadges from './MovieGenreBadges';
import MovieStatusBadge from './MovieStatusBadge';
import MovieTitleCell from './MovieTitleCell';

const CELL_CLASSES: string = 'px-3 py-3 xl:px-4';
const HEADER_CLASSES: string = 'whitespace-nowrap px-3 py-2.5 font-semibold xl:px-4';
const WIDE_ONLY_CLASSES: string = 'hidden xl:table-cell';
const EXTRA_WIDE_ONLY_CLASSES: string = 'hidden 2xl:table-cell';

interface MovieTableProps {
   movies: Movie[];
   isAdmin: boolean;
   onMovieRemoved: () => void;
   isDeletedView?: boolean;
   hasActiveFilters?: boolean;
   onResetFilters: () => void;
}

export function MovieTable({
   movies,
   isAdmin,
   onMovieRemoved,
   isDeletedView = false,
   hasActiveFilters = false,
   onResetFilters,
}: MovieTableProps): ReactElement {
   const location: Location = useLocation();
   const movieListReturnState: MovieListReturnState = { movieListSearch: location.search };
   const [pendingDeleteMovie, setPendingDeleteMovie] = useState<Movie | null>(null);

   function handleDeleted(): void {
      setPendingDeleteMovie(null);
      onMovieRemoved();
   }

   function renderActions(movie: Movie): ReactElement {
      return (
         <MovieActions
            movie={movie}
            movieListReturnState={movieListReturnState}
            isAdmin={isAdmin}
            onDelete={setPendingDeleteMovie}
            onRestored={onMovieRemoved}
         />
      );
   }

   if (movies.length === 0) {
      return (
         <MovieEmptyState
            isDeletedView={isDeletedView}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={onResetFilters}
         />
      );
   }

   return (
      <div>
         <ul className="space-y-3 md:hidden">
            {movies.map((movie) => (
               <MovieAdminCard key={movie.id} movie={movie} movieListReturnState={movieListReturnState}>
                  {renderActions(movie)}
               </MovieAdminCard>
            ))}
         </ul>

         <div className="hidden overflow-x-auto rounded-3xl bg-white shadow-card ring-1 ring-ink-200/80 md:block">
            <table className="w-full text-left text-sm">
               <thead className="border-b border-ink-100 bg-ink-50/80 text-[11px] uppercase tracking-wider text-ink-500">
                  <tr>
                     <th className={HEADER_CLASSES}>Phim</th>
                     <th className={`${HEADER_CLASSES} ${WIDE_ONLY_CLASSES}`}>Độ tuổi</th>
                     <th className={`${HEADER_CLASSES} ${EXTRA_WIDE_ONLY_CLASSES}`}>Thời lượng</th>
                     <th className={HEADER_CLASSES}>Khởi chiếu</th>
                     <th className={`${HEADER_CLASSES} ${WIDE_ONLY_CLASSES}`}>Thể loại</th>
                     <th className={HEADER_CLASSES}>Trạng thái</th>
                     <th className={`${HEADER_CLASSES} text-right`}>Thao tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-ink-100">
                  {movies.map((movie) => (
                     <tr key={movie.id} className="hover:bg-ink-50/60">
                        <td className={`${CELL_CLASSES} max-w-[300px]`}>
                           <MovieTitleCell movie={movie} movieListReturnState={movieListReturnState}>
                              <span className="mt-1 block xl:hidden">
                                 <AgeRatingBadge ageRating={movie.rated} />
                              </span>
                           </MovieTitleCell>
                        </td>
                        <td className={`${CELL_CLASSES} ${WIDE_ONLY_CLASSES}`}>
                           <AgeRatingBadge ageRating={movie.rated} />
                        </td>
                        <td className={`${CELL_CLASSES} ${EXTRA_WIDE_ONLY_CLASSES} whitespace-nowrap text-ink-700`}>
                           {formatDuration(movie.durationMinutes)}
                        </td>
                        <td className={`${CELL_CLASSES} whitespace-nowrap text-ink-700`}>
                           {formatReleaseDate(movie.releaseDate)}
                           <span className="block text-xs text-ink-500 2xl:hidden">
                              {formatDuration(movie.durationMinutes)}
                           </span>
                        </td>
                        <td className={`${CELL_CLASSES} ${WIDE_ONLY_CLASSES}`}>
                           <div className="min-w-44">
                              <MovieGenreBadges genres={movie.genres} />
                           </div>
                        </td>
                        <td className={CELL_CLASSES}>
                           <MovieStatusBadge movieStatus={movie.status} isDeleted={movie.deleted} />
                        </td>
                        <td className={`${CELL_CLASSES} text-right`}>{renderActions(movie)}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {pendingDeleteMovie && (
            <DeleteMovieDialog
               key={pendingDeleteMovie.id}
               movie={pendingDeleteMovie}
               onClose={() => setPendingDeleteMovie(null)}
               onDeleted={handleDeleted}
            />
         )}
      </div>
   );
}

export default MovieTable;
