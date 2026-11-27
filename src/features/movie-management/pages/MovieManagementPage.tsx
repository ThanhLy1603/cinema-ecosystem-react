import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query';
import { FileSpreadsheet, Images, Plus } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import { Navigate, useSearchParams, type SetURLSearchParams } from 'react-router-dom';
import { searchAdminMovies } from '@/api/movie/movieApi';
import { exportMovies } from '@/api/movie/movieExportApi';
import Pagination from '@/components/common/Pagination';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/common/apiError';
import { useAuthStore } from '@/stores/useAuthStore';
import type { PageResponse } from '@/types/common/api';
import type { AdminMovieSearchParams, AgeRating, Genre, Movie, MovieDetail, MovieStatus } from '@/types/movie/movie';
import ExportExcelButton from '../components/ExportExcelButton';
import MovieBulkMediaModal from '../components/MovieBulkMediaModal';
import MovieBulkStatusBar from '../components/MovieBulkStatusBar';
import MovieCreateModal from '../components/MovieCreateModal';
import MovieEditModal from '../components/MovieEditModal';
import MovieFilterBar from '../components/MovieFilterBar';
import MovieImportModal from '../components/MovieImportModal';
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

type MovieModal = 'CREATE' | 'IMPORT' | 'MEDIA';

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
   const [openModal, setOpenModal] = useState<MovieModal | null>(null);
   const [editingMovieId, setEditingMovieId] = useState<number | null>(null);
   const [successMessage, setSuccessMessage] = useState<string | null>(null);
   const [selectedMovieIds, setSelectedMovieIds] = useState<number[]>([]);
   const visibleSelectedMovieIds: number[] = (moviesQuery.data?.content ?? [])
      .map((movie) => movie.id)
      .filter((movieId) => selectedMovieIds.includes(movieId));

   function clearSelection(): void {
      setSelectedMovieIds([]);
   }

   function showModal(movieModal: MovieModal): void {
      setSuccessMessage(null);
      setOpenModal(movieModal);
   }

   function closeModal(): void {
      setOpenModal(null);
   }

   function handleMovieCreated(movieDetail: MovieDetail): void {
      closeModal();
      setSuccessMessage(`Đã tạo phim ${movieDetail.title}.`);
   }

   function showEditModal(movie: Movie): void {
      setSuccessMessage(null);
      setEditingMovieId(movie.id);
   }

   function closeEditModal(): void {
      setEditingMovieId(null);
   }

   function handleMovieSaved(movieDetail: MovieDetail): void {
      closeEditModal();
      setSuccessMessage(`Đã lưu phim ${movieDetail.title}.`);
   }

   function handleFiltersChange(nextAdminMovieFilters: AdminMovieFilters): void {
      setSelectedMovieIds([]);
      setSearchParams(buildMovieSearchParams(nextAdminMovieFilters, 0), { replace: true });
   }

   function handleViewChange(movieViewTab: MovieViewTab): void {
      handleFiltersChange({ ...adminMovieFilters, status: movieViewTab.status, deleted: movieViewTab.deleted });
   }

   function handlePageChange(nextPage: number): void {
      setSelectedMovieIds([]);
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
               <h1 className="text-2xl font-bold text-ink-900">Quản lý phim</h1>
               <p className="mt-1 text-sm text-ink-500">
                  Danh mục phim, nhãn độ tuổi, thể loại và đội ngũ làm phim của cả hệ thống.
               </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
               <ExportExcelButton filePrefix="danh-sach-phim" exportFile={() => exportMovies(adminMovieSearchParams)} />
               <Button
                  variant="secondary"
                  icon={<FileSpreadsheet className="size-4" aria-hidden="true" />}
                  onClick={() => showModal('IMPORT')}
               >
                  Nhập từ Excel
               </Button>
               <Button
                  variant="secondary"
                  icon={<Images className="size-4" aria-hidden="true" />}
                  onClick={() => showModal('MEDIA')}
               >
                  Tải ảnh hàng loạt
               </Button>
               <Button icon={<Plus className="size-4" aria-hidden="true" />} onClick={() => showModal('CREATE')}>
                  Thêm phim
               </Button>
            </div>
         </header>

         {successMessage && <Alert variant="success">{successMessage}</Alert>}

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

         {adminMovieFilters.deleted !== 'true' && (
            <MovieBulkStatusBar selectedMovieIds={visibleSelectedMovieIds} onClearSelection={clearSelection} />
         )}

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
                  onCreateMovie={() => showModal('CREATE')}
                  onEditMovie={showEditModal}
                  selectedMovieIds={visibleSelectedMovieIds}
                  onSelectionChange={setSelectedMovieIds}
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

         {openModal === 'CREATE' && <MovieCreateModal onClose={closeModal} onCreated={handleMovieCreated} />}
         {openModal === 'IMPORT' && <MovieImportModal onClose={closeModal} onOpenMedia={() => showModal('MEDIA')} />}
         {openModal === 'MEDIA' && <MovieBulkMediaModal onClose={closeModal} />}
         {editingMovieId !== null && (
            <MovieEditModal movieId={editingMovieId} onClose={closeEditModal} onSaved={handleMovieSaved} />
         )}
      </div>
   );
}

export default MovieManagementPage;
