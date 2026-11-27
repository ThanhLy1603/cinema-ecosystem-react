import type { ReactElement } from 'react';
import { restoreMovie } from '@/api/movie/movieApi';
import RestoreButton from '@/components/common/RestoreButton';
import type { Movie } from '@/types/movie/movie';
import type { MovieListReturnState } from '../utils/listReturnPath';
import MovieRowActions from './MovieRowActions';

interface MovieActionsProps {
   movie: Movie;
   movieListReturnState: MovieListReturnState;
   isAdmin: boolean;
   onDelete: (movie: Movie) => void;
   onRestored: () => void;
}

export function MovieActions({
   movie,
   movieListReturnState,
   isAdmin,
   onDelete,
   onRestored,
}: MovieActionsProps): ReactElement | null {
   if (!movie.deleted) {
      return (
         <MovieRowActions
            movie={movie}
            movieListReturnState={movieListReturnState}
            canDelete={isAdmin}
            onDelete={onDelete}
         />
      );
   }
   return isAdmin ? <RestoreButton restore={() => restoreMovie(movie.id)} onRestored={onRestored} /> : null;
}

export default MovieActions;
