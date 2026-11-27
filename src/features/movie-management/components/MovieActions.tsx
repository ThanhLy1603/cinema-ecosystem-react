import type { ReactElement } from 'react';
import { restoreMovie } from '@/api/movie/movieApi';
import RestoreButton from '@/components/common/RestoreButton';
import type { Movie } from '@/types/movie/movie';
import MovieRowActions from './MovieRowActions';

interface MovieActionsProps {
   movie: Movie;
   onEdit: (movie: Movie) => void;
   isAdmin: boolean;
   onDelete: (movie: Movie) => void;
   onRestored: () => void;
}

export function MovieActions({ movie, onEdit, isAdmin, onDelete, onRestored }: MovieActionsProps): ReactElement | null {
   if (!movie.deleted) {
      return <MovieRowActions movie={movie} onEdit={onEdit} canDelete={isAdmin} onDelete={onDelete} />;
   }
   return isAdmin ? <RestoreButton restore={() => restoreMovie(movie.id)} onRestored={onRestored} /> : null;
}

export default MovieActions;
