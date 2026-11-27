import { useState, type ReactElement } from 'react';
import AgeRatingBadge from '@/components/common/AgeRatingBadge';
import { formatDuration, formatReleaseDate } from '@/lib/movie/movieFormat';
import type { Movie } from '@/types/movie/movie';
import DeleteMovieDialog from './DeleteMovieDialog';
import MovieActions from './MovieActions';
import MovieAdminCard from './MovieAdminCard';
import MovieEmptyState from './MovieEmptyState';
import MovieGenreBadges from './MovieGenreBadges';
import MovieSelectCheckbox from './MovieSelectCheckbox';
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
   onCreateMovie: () => void;
   onEditMovie: (movie: Movie) => void;
   selectedMovieIds: number[];
   onSelectionChange: (selectedMovieIds: number[]) => void;
}

export function MovieTable({
   movies,
   isAdmin,
   onMovieRemoved,
   isDeletedView = false,
   hasActiveFilters = false,
   onResetFilters,
   onCreateMovie,
   onEditMovie,
   selectedMovieIds,
   onSelectionChange,
}: MovieTableProps): ReactElement {
   const [pendingDeleteMovie, setPendingDeleteMovie] = useState<Movie | null>(null);

   function handleDeleted(): void {
      setPendingDeleteMovie(null);
      onMovieRemoved();
   }

   function renderActions(movie: Movie): ReactElement {
      return (
         <MovieActions
            movie={movie}
            onEdit={onEditMovie}
            isAdmin={isAdmin}
            onDelete={setPendingDeleteMovie}
            onRestored={onMovieRemoved}
         />
      );
   }

   const isAllSelected: boolean = movies.every((movie) => selectedMovieIds.includes(movie.id));

   function toggleAll(): void {
      onSelectionChange(isAllSelected ? [] : movies.map((movie) => movie.id));
   }

   function toggleMovie(movieId: number): void {
      onSelectionChange(
         selectedMovieIds.includes(movieId)
            ? selectedMovieIds.filter((selectedMovieId) => selectedMovieId !== movieId)
            : [...selectedMovieIds, movieId],
      );
   }

   function renderSelection(movie: Movie): ReactElement | null {
      if (isDeletedView) {
         return null;
      }
      return (
         <MovieSelectCheckbox
            label={`Chọn phim ${movie.title}`}
            checked={selectedMovieIds.includes(movie.id)}
            onToggle={() => toggleMovie(movie.id)}
         />
      );
   }

   if (movies.length === 0) {
      return (
         <MovieEmptyState
            isDeletedView={isDeletedView}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={onResetFilters}
            onCreateMovie={onCreateMovie}
         />
      );
   }

   return (
      <div>
         <ul className="space-y-3 md:hidden">
            {!isDeletedView && (
               <li className="flex items-center gap-2 px-3 text-sm font-semibold text-ink-700">
                  <MovieSelectCheckbox
                     label="Chọn tất cả phim trong trang"
                     checked={isAllSelected}
                     onToggle={toggleAll}
                  />
                  Chọn tất cả
               </li>
            )}
            {movies.map((movie) => (
               <MovieAdminCard key={movie.id} movie={movie} onEdit={onEditMovie} selection={renderSelection(movie)}>
                  {renderActions(movie)}
               </MovieAdminCard>
            ))}
         </ul>

         <div className="hidden overflow-x-auto rounded-3xl bg-white shadow-card ring-1 ring-ink-200/80 md:block">
            <table className="w-full text-left text-sm">
               <thead className="border-b border-ink-100 bg-ink-50/80 text-xs text-ink-500">
                  <tr>
                     {!isDeletedView && (
                        <th className="w-12 px-2 py-2.5">
                           <MovieSelectCheckbox
                              label="Chọn tất cả phim trong trang"
                              checked={isAllSelected}
                              onToggle={toggleAll}
                           />
                        </th>
                     )}
                     <th data-align="left" className={HEADER_CLASSES}>
                        Phim
                     </th>
                     <th className={`${HEADER_CLASSES} ${WIDE_ONLY_CLASSES}`}>Độ tuổi</th>
                     <th className={`${HEADER_CLASSES} ${EXTRA_WIDE_ONLY_CLASSES}`}>Thời lượng</th>
                     <th className={HEADER_CLASSES}>Khởi chiếu</th>
                     <th className={`${HEADER_CLASSES} ${WIDE_ONLY_CLASSES}`}>Thể loại</th>
                     <th className={HEADER_CLASSES}>Trạng thái</th>
                     <th className={HEADER_CLASSES}></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-ink-100">
                  {movies.map((movie) => (
                     <tr key={movie.id} className="hover:bg-ink-50/60">
                        {!isDeletedView && <td className="px-2 py-3">{renderSelection(movie)}</td>}
                        <td data-align="left" className={`${CELL_CLASSES} max-w-[300px]`}>
                           <MovieTitleCell movie={movie} onEdit={onEditMovie}>
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
                           <div className="min-w-40 [&>div]:justify-center">
                              <MovieGenreBadges genres={movie.genres} />
                           </div>
                        </td>
                        <td className={CELL_CLASSES}>
                           <MovieStatusBadge movieStatus={movie.status} isDeleted={movie.deleted} />
                        </td>
                        <td className={CELL_CLASSES}>{renderActions(movie)}</td>
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
