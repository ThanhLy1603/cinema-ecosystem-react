import type { ReactElement } from 'react';
import { deleteMovie } from '@/api/movie/movieApi';
import type { Movie } from '@/types/movie/movie';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

interface DeleteMovieDialogProps {
   movie: Movie;
   onClose: () => void;
   onDeleted: () => void;
}

export function DeleteMovieDialog({ movie, onClose, onDeleted }: DeleteMovieDialogProps): ReactElement {
   return (
      <ConfirmDeleteDialog
         title="Xóa phim?"
         confirmLabel="Xóa phim"
         deleteEntity={() => deleteMovie(movie.id)}
         onClose={onClose}
         onDeleted={onDeleted}
      >
         Phim <strong className="text-ink-900">{movie.title}</strong> sẽ bị ẩn khỏi danh sách và trang khách hàng. Có
         thể khôi phục trong tab «Đã xóa».
      </ConfirmDeleteDialog>
   );
}

export default DeleteMovieDialog;
