import { useMutation, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import { useState, type ReactElement } from 'react';
import { createMovie } from '@/api/movie/movieApi';
import Modal from '@/components/common/Modal';
import { getErrorMessage } from '@/lib/common/apiError';
import type { Genre, MovieDetail, MovieRequest, PersonOption } from '@/types/movie/movie';
import { useGenres } from '../hooks/useGenres';
import { useMovieRefresh } from '../hooks/useMovieRefresh';
import { usePersonOptions } from '../hooks/usePersonOptions';
import { getMovieServerFieldErrors } from '../utils/serverErrors';
import MovieForm from './MovieForm';

interface MovieCreateModalProps {
   onClose: () => void;
   onCreated: (movieDetail: MovieDetail) => void;
}

export function MovieCreateModal({ onClose, onCreated }: MovieCreateModalProps): ReactElement {
   const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
   const refreshMovies: () => void = useMovieRefresh(null);
   const genresQuery: UseQueryResult<Genre[]> = useGenres();
   const personOptionsQuery: UseQueryResult<PersonOption[]> = usePersonOptions();

   function handleCreated(movieDetail: MovieDetail): void {
      refreshMovies();
      onCreated(movieDetail);
   }

   const createMutation: UseMutationResult<MovieDetail, unknown, MovieRequest> = useMutation<
      MovieDetail,
      unknown,
      MovieRequest
   >({
      mutationFn: createMovie,
      onSuccess: handleCreated,
   });

   const serverFieldErrors: Record<string, string> = createMutation.isError
      ? getMovieServerFieldErrors(createMutation.error)
      : {};
   const hasFieldErrors: boolean = Object.keys(serverFieldErrors).length > 0;

   return (
      <Modal
         title="Thêm phim"
         size="wide"
         isFlush
         isDismissDisabled={isFormBusy || createMutation.isPending}
         onClose={onClose}
      >
         <MovieForm
            onBusyChange={setIsFormBusy}
            genres={genresQuery.data ?? []}
            personOptions={personOptionsQuery.data ?? []}
            isSubmitting={createMutation.isPending}
            submitLabel="Tạo phim"
            errorMessage={createMutation.isError && !hasFieldErrors ? getErrorMessage(createMutation.error) : undefined}
            serverFieldErrors={serverFieldErrors}
            onSubmit={(movieRequest) => createMutation.mutate(movieRequest)}
         />
      </Modal>
   );
}

export default MovieCreateModal;
