import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import type { ReactElement } from 'react';
import { Navigate, useSearchParams, type SetURLSearchParams } from 'react-router-dom';
import { searchAdminMovies } from '@/api/movie/movieApi';
import Pagination from '@/components/common/Pagination';
import Alert from '@/components/ui/Alert';
import LinkButton from '@/components/ui/LinkButton';
import { getErrorMessage } from '@/lib/common/apiError';
import { useAuthStore } from '@/stores/useAuthStore';
import type { PageResponse } from '@/types/common/api';
import type { AdminMovieSearchParams, AgeRating, Genre, Movie, MovieStatus } from '@/types/movie/movie';
import MovieFilterBar from '../components/MovieFilterBar';
import MovieSectionTabs from '../components/MovieSectionTabs';
import MovieTable from '../components/MovieTable';
import MovieViewTabs from '../components/MovieViewTabs';
import { useGenres } from '../hooks/useGenres';
import { useMovieRefresh } from '../hooks/useMovieRefresh';
import {
   buildMovieSearchParams,
   EMPTY_MOVIE_FILTERS,
   hasActiveMovieFilters,
   parseMovieFilters,
   parseMoviePage,
   type AdminMovieFilters,
} from '../utils/filterParams';
import { ACTIVE_MOVIE_VIEW_TABS, DELETED_MOVIE_VIEW_TAB, type MovieViewTab } from '../utils/labels';
import { ADMIN_MOVIE_LIST_KEY } from '../utils/queryKeys';

const PAGE_SIZE: number = 20;

function toSearchParams(adminMovieFilters: AdminMovieFilters, page: number): AdminMovieSearchParams {
   return {
      keyword: adminMovieFilters.keyword || undefined,
      genreId: adminMovieFilters.genreId ? Number(adminMovieFilters.genreId) : undefined,
      status: (adminMovieFilters.status || undefined) as MovieStatus | undefined,
      rated: (adminMovieFilters.rated || undefined) as AgeRating | undefined,
      deleted: adminMovieFilters.deleted === 'true',
      page,
      size: PAGE_SIZE,
   };
}

export function MovieManagementPage(): ReactElement {
   const [searchParams, setSearchParams]: [URLSearchParams, SetURLSearchParams] = useSearchParams();
   const isAdmin: boolean = useAuthStore((authState) => authState.hasRole('ROLE_ADMIN'));
   const adminMovieFilters: AdminMovieFilters = parseMovieFilters(searchParams, isAdmin);
   const page: number = parseMoviePage(searchParams);
   const adminMovieSearchParams: AdminMovieSearchParams = toSearchParams(adminMovieFilters, page);
   const movieViewTabs: MovieViewTab[] = isAdmin
      ? [...ACTIVE_MOVIE_VIEW_TABS, DELETED_MOVIE_VIEW_TAB]
      : ACTIVE_MOVIE_VIEW_TABS;
   const activeMovieViewTab: MovieViewTab | undefined = movieViewTabs.find(
      (movieViewTab) =>
         movieViewTab.status === adminMovieFilters.status && movieViewTab.deleted === adminMovieFilters.deleted,
   );
   const genresQuery: UseQueryResult<Genre[]> = useGenres();
   const moviesQuery: UseQueryResult<PageResponse<Movie>> = useQuery<PageResponse<Movie>>({
      queryKey: [...ADMIN_MOVIE_LIST_KEY, adminMovieSearchParams],
      queryFn: () => searchAdminMovies(adminMovieSearchParams),
      placeholderData: keepPreviousData,
   });
   const refreshMovies: () => void = useMovieRefresh(null);

   function handleFiltersChange(nextAdminMovieFilters: AdminMovieFilters): void {
      setSearchParams(buildMovieSearchParams(nextAdminMovieFilters, 0), { replace: true });
   }

   function handleViewChange(movieViewTab: MovieViewTab): void {
      handleFiltersChange({ ...adminMovieFilters, status: movieViewTab.status, deleted: movieViewTab.deleted });
   }

   function handlePageChange(nextPage: number): void {
      setSearchParams(buildMovieSearchParams(adminMovieFilters, nextPage), { replace: true });
   }

   function handleResetFilters(): void {
      handleFiltersChange({ ...EMPTY_MOVIE_FILTERS, deleted: adminMovieFilters.deleted });
   }

   const totalPages: number = moviesQuery.data?.totalPages ?? 0;
   const isPageOutOfRange: boolean = !moviesQuery.isPlaceholderData && totalPages > 0 && page >= totalPages;

   return (
      <div className="w-full max-w-7xl space-y-5">
         <MovieSectionTabs />

         <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
               <h1 className="text-xl font-semibold tracking-tight text-ink-900">Quản lý phim</h1>
               <p className="mt-1 text-sm text-ink-500">
                  Danh mục phim, nhãn độ tuổi, thể loại và đội ngũ làm phim của cả hệ thống.
               </p>
            </div>
            <LinkButton to="/admin/movies/new" icon={<Plus className="size-4" aria-hidden="true" />}>
               Thêm phim
            </LinkButton>
         </header>

         <MovieViewTabs
            movieViewTabs={movieViewTabs}
            activeKey={activeMovieViewTab?.key ?? ''}
            onChange={handleViewChange}
         />

         <MovieFilterBar
            adminMovieFilters={adminMovieFilters}
            genres={genresQuery.data ?? []}
            onChange={handleFiltersChange}
         />

         {moviesQuery.isError && <Alert variant="error">{getErrorMessage(moviesQuery.error)}</Alert>}
         {isPageOutOfRange && (
            <Navigate to={{ search: buildMovieSearchParams(adminMovieFilters, totalPages - 1).toString() }} replace />
         )}
         {moviesQuery.data && !isPageOutOfRange && (
            <>
               <MovieTable
                  movies={moviesQuery.data.content}
                  isAdmin={isAdmin}
                  onMovieRemoved={refreshMovies}
                  isDeletedView={adminMovieFilters.deleted === 'true'}
                  hasActiveFilters={hasActiveMovieFilters({ ...adminMovieFilters, deleted: '' })}
                  onResetFilters={handleResetFilters}
               />
               <Pagination
                  page={moviesQuery.data.page}
                  totalPages={moviesQuery.data.totalPages}
                  totalElements={moviesQuery.data.totalElements}
                  onPageChange={handlePageChange}
               />
            </>
         )}
         {moviesQuery.isPending && <p className="text-sm text-ink-500">Đang tải danh sách...</p>}
      </div>
   );
}

export default MovieManagementPage;
