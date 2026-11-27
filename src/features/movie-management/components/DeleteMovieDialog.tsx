import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useLayoutEffect, useRef, type MouseEvent, type ReactElement, type SyntheticEvent } from 'react';
import { deleteMovie } from '@/api/movie/movieApi';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/common/apiError';
import type { Movie } from '@/types/movie/movie';

interface DeleteMovieDialogProps {
   movie: Movie;
   onClose: () => void;
   onDeleted: () => void;
}

export function DeleteMovieDialog({ movie, onClose, onDeleted }: DeleteMovieDialogProps): ReactElement {
   const dialogRef = useRef<HTMLDialogElement>(null);
   const deleteMutation: UseMutationResult<void, unknown, void> = useMutation<void, unknown, void>({
      mutationFn: () => deleteMovie(movie.id),
      onSuccess: onDeleted,
   });

   useLayoutEffect((): (() => void) => {
      const htmlDialogElement: HTMLDialogElement | null = dialogRef.current;
      htmlDialogElement?.showModal();
      return (): void => htmlDialogElement?.close();
   }, []);

   function requestClose(): void {
      if (!deleteMutation.isPending) {
         onClose();
      }
   }

   function handleCancel(syntheticEvent: SyntheticEvent<HTMLDialogElement>): void {
      syntheticEvent.preventDefault();
      requestClose();
   }

   function handleNativeClose(): void {
      if (!dialogRef.current?.open) {
         onClose();
      }
   }

   function handleBackdropClick(mouseEvent: MouseEvent<HTMLDialogElement>): void {
      if (mouseEvent.target === mouseEvent.currentTarget) {
         requestClose();
      }
   }

   return (
      <dialog
         ref={dialogRef}
         onCancel={handleCancel}
         onClose={handleNativeClose}
         onClick={handleBackdropClick}
         aria-labelledby="delete-movie-dialog-title"
         className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl bg-white p-0 shadow-soft backdrop:bg-ink-900/30"
      >
         <div className="space-y-4 p-5">
            <h2 id="delete-movie-dialog-title" className="text-[15px] font-semibold text-ink-900">
               Xóa phim?
            </h2>
            <p className="text-sm text-ink-600">
               Phim <strong className="text-ink-900">{movie.title}</strong> sẽ bị ẩn khỏi danh sách và trang khách hàng.
               Có thể khôi phục trong tab «Đã xóa».
            </p>
            {deleteMutation.isError && <Alert variant="error">{getErrorMessage(deleteMutation.error)}</Alert>}
            <div className="flex justify-end gap-3">
               <Button variant="secondary" disabled={deleteMutation.isPending} onClick={onClose}>
                  Hủy
               </Button>
               <Button
                  isLoading={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate()}
                  className="shadow-none [background:var(--color-danger-600)] hover:[background:var(--color-danger-700)]"
               >
                  Xóa phim
               </Button>
            </div>
         </div>
      </dialog>
   );
}

export default DeleteMovieDialog;
