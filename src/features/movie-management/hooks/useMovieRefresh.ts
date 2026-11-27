import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { PUBLIC_MOVIES_KEY } from '@/lib/movie/movieQueryKeys';
import {
   ADMIN_MOVIE_LIST_KEY,
   ADMIN_PERSONS_KEY,
   adminMovieDetailKey,
   MOVIE_MEDIA_TARGETS_KEY,
   PERSON_OPTIONS_KEY,
} from '../utils/queryKeys';

export function useMovieRefresh(movieId: number | null): () => void {
   const queryClient: QueryClient = useQueryClient();

   return function refreshMovie(): void {
      void queryClient.invalidateQueries({ queryKey: ADMIN_MOVIE_LIST_KEY });
      void queryClient.invalidateQueries({ queryKey: PUBLIC_MOVIES_KEY });
      void queryClient.invalidateQueries({ queryKey: MOVIE_MEDIA_TARGETS_KEY });
      void queryClient.invalidateQueries({ queryKey: ADMIN_PERSONS_KEY });
      void queryClient.invalidateQueries({ queryKey: PERSON_OPTIONS_KEY });
      if (movieId !== null) {
         void queryClient.invalidateQueries({ queryKey: adminMovieDetailKey(movieId) });
      }
   };
}
