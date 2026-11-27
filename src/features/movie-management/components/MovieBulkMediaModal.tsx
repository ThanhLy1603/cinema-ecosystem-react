import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { Upload } from 'lucide-react';
import type { ReactElement } from 'react';
import { getMovieMediaTargets } from '@/api/movie/movieMediaApi';
import Modal from '@/components/common/Modal';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import type { SelectOption } from '@/components/ui/SelectField';
import { getErrorMessage } from '@/lib/common/apiError';
import { MOVIE_STATUS_LABELS } from '@/lib/movie/movieLabels';
import type { MovieMediaTarget } from '@/types/movie/movieMedia';
import { useBulkMediaUpload, type BulkMediaUpload, type MediaUploadItem } from '../hooks/useBulkMediaUpload';
import { useMovieRefresh } from '../hooks/useMovieRefresh';
import { getCurrentMediaUrl, MEDIA_FILE_ACCEPT } from '../utils/mediaFileMatching';
import { MOVIE_MEDIA_TARGETS_KEY } from '../utils/queryKeys';
import FileDropZone from './FileDropZone';
import MediaUploadRow from './MediaUploadRow';

function getMatchProblem(mediaUploadItem: MediaUploadItem, mediaUploadItems: MediaUploadItem[]): string | null {
   if (!mediaUploadItem.movieId) {
      return 'Chưa khớp phim nào, hãy chọn phim';
   }
   if (!mediaUploadItem.movieMediaKind) {
      return 'Hãy chọn loại tệp';
   }
   const isRepeated: boolean = mediaUploadItems.some(
      (otherMediaUploadItem) =>
         otherMediaUploadItem.key !== mediaUploadItem.key &&
         otherMediaUploadItem.status !== 'DONE' &&
         otherMediaUploadItem.movieId === mediaUploadItem.movieId &&
         otherMediaUploadItem.movieMediaKind === mediaUploadItem.movieMediaKind,
   );
   return isRepeated ? 'Có hai tệp cùng loại cho một phim, hãy bỏ bớt một tệp' : null;
}

interface MovieBulkMediaModalProps {
   onClose: () => void;
}

export function MovieBulkMediaModal({ onClose }: MovieBulkMediaModalProps): ReactElement {
   const refreshMovies: () => void = useMovieRefresh(null);
   const movieMediaTargetsQuery: UseQueryResult<MovieMediaTarget[]> = useQuery<MovieMediaTarget[]>({
      queryKey: MOVIE_MEDIA_TARGETS_KEY,
      queryFn: getMovieMediaTargets,
   });
   const bulkMediaUpload: BulkMediaUpload = useBulkMediaUpload(refreshMovies);
   const movieMediaTargets: MovieMediaTarget[] = movieMediaTargetsQuery.data ?? [];
   const { mediaUploadItems, isUploading } = bulkMediaUpload;
   const movieOptions: SelectOption[] = movieMediaTargets.map((movieMediaTarget) => ({
      value: String(movieMediaTarget.id),
      label: `${movieMediaTarget.title} · ${MOVIE_STATUS_LABELS[movieMediaTarget.status]}`,
   }));
   const readyMediaUploadItems: MediaUploadItem[] = mediaUploadItems.filter(
      (mediaUploadItem) =>
         mediaUploadItem.status !== 'DONE' && getMatchProblem(mediaUploadItem, mediaUploadItems) === null,
   );
   const doneCount: number = mediaUploadItems.filter((mediaUploadItem) => mediaUploadItem.status === 'DONE').length;

   function replacesExistingMedia(mediaUploadItem: MediaUploadItem): boolean {
      const movieMediaTarget: MovieMediaTarget | undefined = movieMediaTargets.find(
         (candidateMovieMediaTarget) => String(candidateMovieMediaTarget.id) === mediaUploadItem.movieId,
      );
      return Boolean(
         movieMediaTarget &&
         mediaUploadItem.movieMediaKind &&
         getCurrentMediaUrl(movieMediaTarget, mediaUploadItem.movieMediaKind),
      );
   }

   return (
      <Modal title="Tải ảnh và trailer hàng loạt" size="wide" isFlush isDismissDisabled={isUploading} onClose={onClose}>
         <div className="relative min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
            <p className="text-sm text-ink-500">
               Đặt tên tệp theo đường dẫn phim rồi thêm loại, ví dụ mai-poster.jpg, mai-banner.jpg, mai-trailer.mp4.
            </p>

            <FileDropZone
               title="Kéo thả nhiều tệp vào đây"
               hint="Poster tối đa 5 MB, banner 8 MB, trailer 100 MB."
               accept={MEDIA_FILE_ACCEPT}
               buttonLabel="Chọn tệp từ máy"
               multiple
               disabled={isUploading || !movieMediaTargetsQuery.isSuccess}
               onFilesSelected={(files) => bulkMediaUpload.addFiles(files, movieMediaTargets)}
            />

            {movieMediaTargetsQuery.isError && (
               <Alert variant="error">{getErrorMessage(movieMediaTargetsQuery.error)}</Alert>
            )}

            {mediaUploadItems.length > 0 && (
               <section>
                  <h3 className="text-base font-bold text-ink-900">Tệp đã chọn</h3>
                  <p className="text-sm text-ink-500">
                     Sẵn sàng {readyMediaUploadItems.length}, đã xong {doneCount} trên {mediaUploadItems.length} tệp.
                  </p>
                  <ul className="divide-y divide-ink-100">
                     {mediaUploadItems.map((mediaUploadItem) => (
                        <MediaUploadRow
                           key={mediaUploadItem.key}
                           mediaUploadItem={mediaUploadItem}
                           movieOptions={movieOptions}
                           problem={getMatchProblem(mediaUploadItem, mediaUploadItems)}
                           replacesExisting={replacesExistingMedia(mediaUploadItem)}
                           disabled={isUploading}
                           onChange={(mediaFileMatch) =>
                              bulkMediaUpload.changeMatch(mediaUploadItem.key, mediaFileMatch)
                           }
                           onRemove={() => bulkMediaUpload.removeItem(mediaUploadItem.key)}
                        />
                     ))}
                  </ul>
               </section>
            )}
         </div>

         {mediaUploadItems.length > 0 && (
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-ink-100 px-5 py-3">
               {doneCount > 0 && (
                  <Button variant="secondary" disabled={isUploading} onClick={bulkMediaUpload.clearUploaded}>
                     Dọn tệp đã xong
                  </Button>
               )}
               <Button
                  disabled={readyMediaUploadItems.length === 0}
                  isLoading={isUploading}
                  icon={<Upload className="size-4" aria-hidden="true" />}
                  onClick={() => void bulkMediaUpload.uploadItems(readyMediaUploadItems)}
               >
                  Tải lên {readyMediaUploadItems.length} tệp
               </Button>
            </div>
         )}
      </Modal>
   );
}

export default MovieBulkMediaModal;
