import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useState, type ReactElement } from 'react';
import { changeMovieStatuses } from '@/api/movie/movieStatusApi';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import SelectField from '@/components/ui/SelectField';
import { getErrorMessage } from '@/lib/common/apiError';
import { MOVIE_STATUS_LABELS, MOVIE_STATUS_OPTIONS } from '@/lib/movie/movieLabels';
import type { MovieStatus } from '@/types/movie/movie';
import type { MovieStatusBulkRequest, MovieStatusBulkResponse } from '@/types/movie/movieStatus';
import { useMovieRefresh } from '../hooks/useMovieRefresh';

interface MovieBulkStatusBarProps {
   selectedMovieIds: number[];
   onClearSelection: () => void;
}

export function MovieBulkStatusBar({
   selectedMovieIds,
   onClearSelection,
}: MovieBulkStatusBarProps): ReactElement | null {
   const [nextStatus, setNextStatus] = useState<string>('');
   const refreshMovies: () => void = useMovieRefresh(null);

   function handleChanged(): void {
      refreshMovies();
      setNextStatus('');
      onClearSelection();
   }

   const statusMutation: UseMutationResult<MovieStatusBulkResponse, unknown, MovieStatusBulkRequest> = useMutation<
      MovieStatusBulkResponse,
      unknown,
      MovieStatusBulkRequest
   >({
      mutationFn: changeMovieStatuses,
      onSuccess: handleChanged,
   });
   const hasSelection: boolean = selectedMovieIds.length > 0;
   const movieStatusBulkResponse: MovieStatusBulkResponse | undefined = hasSelection ? undefined : statusMutation.data;

   if (!hasSelection && movieStatusBulkResponse === undefined) {
      return null;
   }

   return (
      <div className="space-y-3">
         {hasSelection && (
            <div className="flex flex-col gap-3 rounded-lg border border-brand-300 bg-brand-50 px-4 py-3 sm:flex-row sm:items-center">
               <p className="text-sm font-bold text-ink-900 sm:flex-1">Đã chọn {selectedMovieIds.length} phim</p>
               <div className="sm:w-56">
                  <SelectField
                     id="movie-bulk-status"
                     label="Trạng thái mới"
                     hideLabel
                     placeholder="Chọn trạng thái mới"
                     value={nextStatus}
                     options={MOVIE_STATUS_OPTIONS}
                     onChange={setNextStatus}
                     searchable={false}
                  />
               </div>
               <Button
                  disabled={nextStatus === ''}
                  isLoading={statusMutation.isPending}
                  onClick={() =>
                     statusMutation.mutate({ movieIds: selectedMovieIds, status: nextStatus as MovieStatus })
                  }
               >
                  Chuyển trạng thái
               </Button>
               <Button variant="ghost" disabled={statusMutation.isPending} onClick={onClearSelection}>
                  Bỏ chọn
               </Button>
            </div>
         )}
         {statusMutation.isError && <Alert variant="error">{getErrorMessage(statusMutation.error)}</Alert>}
         {movieStatusBulkResponse && movieStatusBulkResponse.updatedCount > 0 && statusMutation.variables && (
            <Alert variant="success">
               Đã chuyển {movieStatusBulkResponse.updatedCount} phim sang{' '}
               {MOVIE_STATUS_LABELS[statusMutation.variables.status]}.
            </Alert>
         )}
         {movieStatusBulkResponse && movieStatusBulkResponse.failures.length > 0 && (
            <Alert variant="error">
               {movieStatusBulkResponse.failures.map((movieStatusFailure) => (
                  <span key={movieStatusFailure.movieId} className="block">
                     {movieStatusFailure.title}: {movieStatusFailure.message}
                  </span>
               ))}
            </Alert>
         )}
      </div>
   );
}

export default MovieBulkStatusBar;
