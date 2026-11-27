import { useMutation, useQuery, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { getAdminMovie, updateMovie } from '@/api/movie/movieApi';
import Modal from '@/components/common/Modal';
import Alert from '@/components/ui/Alert';
import { getErrorMessage } from '@/lib/common/apiError';
import { getMovieDetailPath } from '@/lib/movie/moviePath';
import type { Genre, MovieDetail, MovieRequest, PersonOption } from '@/types/movie/movie';
import { useGenres } from '../hooks/useGenres';
import { useMovieRefresh } from '../hooks/useMovieRefresh';
import { usePersonOptions } from '../hooks/usePersonOptions';
import { adminMovieDetailKey } from '../utils/queryKeys';
import { getMovieServerFieldErrors } from '../utils/serverErrors';
import MovieForm from './MovieForm';
import MovieStatusBadge from './MovieStatusBadge';

interface MovieEditModalProps {
   movieId: number;
   onClose: () => void;
   onSaved: (movieDetail: MovieDetail) => void;
}

export function MovieEditModal({ movieId, onClose, onSaved }: MovieEditModalProps): ReactElement {
   const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
   const refreshMovie: () => void = useMovieRefresh(movieId);
   const genresQuery: UseQueryResult<Genre[]> = useGenres();
   const personOptionsQuery: UseQueryResult<PersonOption[]> = usePersonOptions();
   const movieQuery: UseQueryResult<MovieDetail> = useQuery<MovieDetail>({
      queryKey: adminMovieDetailKey(movieId),
      queryFn: () => getAdminMovie(movieId),
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
   });

   function handleSaved(movieDetail: MovieDetail): void {
      refreshMovie();
      onSaved(movieDetail);
   }

   const updateMutation: UseMutationResult<MovieDetail, unknown, MovieRequest> = useMutation<
      MovieDetail,
      unknown,
      MovieRequest
   >({
      mutationFn: (movieRequest) => updateMovie(movieId, movieRequest),
      onSuccess: handleSaved,
   });

   const serverFieldErrors: Record<string, string> = updateMutation.isError
      ? getMovieServerFieldErrors(updateMutation.error)
      : {};
   const hasFieldErrors: boolean = Object.keys(serverFieldErrors).length > 0;
   const movieDetail: MovieDetail | undefined = movieQuery.isFetchedAfterMount ? movieQuery.data : undefined;
   const isLoading: boolean = !movieQuery.isFetchedAfterMount || genresQuery.isPending || personOptionsQuery.isPending;

   function renderContent(): ReactElement {
      if (movieQuery.isError) {
         return (
            <div className="p-5">
               <Alert variant="error">{getErrorMessage(movieQuery.error)}</Alert>
            </div>
         );
      }
      if (isLoading || movieDetail === undefined) {
         return <p className="p-10 text-center text-sm text-ink-500">Đang tải thông tin phim...</p>;
      }
      const header: ReactElement = (
         <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-ink-900">{movieDetail.title}</h3>
            <MovieStatusBadge movieStatus={movieDetail.status} />
            {movieDetail.status !== 'DRAFT' && (
               <Link
                  to={getMovieDetailPath(movieDetail.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
               >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  Xem trang khách hàng
               </Link>
            )}
         </div>
      );
      return (
         <MovieForm
            key={movieDetail.id}
            onBusyChange={setIsFormBusy}
            initialMovie={movieDetail}
            genres={genresQuery.data ?? []}
            personOptions={personOptionsQuery.data ?? []}
            isSubmitting={updateMutation.isPending}
            submitLabel="Lưu thay đổi"
            errorMessage={updateMutation.isError && !hasFieldErrors ? getErrorMessage(updateMutation.error) : undefined}
            serverFieldErrors={serverFieldErrors}
            onSubmit={(movieRequest) => updateMutation.mutate(movieRequest)}
            header={header}
         />
      );
   }

   return (
      <Modal
         title="Chi tiết và chỉnh sửa phim"
         size="wide"
         isFlush
         isDismissDisabled={isFormBusy || updateMutation.isPending}
         onClose={onClose}
      >
         {renderContent()}
      </Modal>
   );
}

export default MovieEditModal;
