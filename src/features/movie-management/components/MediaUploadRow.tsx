import { CircleCheck, LoaderCircle, X } from 'lucide-react';
import type { ReactElement } from 'react';
import SelectField, { type SelectOption } from '@/components/ui/SelectField';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/common/utils';
import type { MovieMediaKind } from '@/types/movie/movieMedia';
import type { MediaUploadItem } from '../hooks/useBulkMediaUpload';
import {
   isKindAllowedForFile,
   MOVIE_MEDIA_KIND_LABELS,
   MOVIE_MEDIA_KINDS,
   type MediaFileMatch,
} from '../utils/mediaFileMatching';

interface MediaUploadRowProps {
   mediaUploadItem: MediaUploadItem;
   movieOptions: SelectOption[];
   problem: string | null;
   replacesExisting: boolean;
   disabled: boolean;
   onChange: (mediaFileMatch: Partial<MediaFileMatch>) => void;
   onRemove: () => void;
}

const BYTES_PER_MEGABYTE: number = 1024 * 1024;

export function MediaUploadRow({
   mediaUploadItem,
   movieOptions,
   problem,
   replacesExisting,
   disabled,
   onChange,
   onRemove,
}: MediaUploadRowProps): ReactElement {
   const { key, file, status, progress, errorMessage } = mediaUploadItem;
   const isDone: boolean = status === 'DONE';
   const isLocked: boolean = disabled || isDone;
   const kindOptions: SelectOption[] = MOVIE_MEDIA_KINDS.filter((movieMediaKind) =>
      isKindAllowedForFile(movieMediaKind, file.name),
   ).map((movieMediaKind) => ({ value: movieMediaKind, label: MOVIE_MEDIA_KIND_LABELS[movieMediaKind] }));

   return (
      <li className="grid grid-cols-1 gap-3 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_180px_40px] lg:items-start">
         <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">{file.name}</p>
            <p className="text-xs text-ink-500">{(file.size / BYTES_PER_MEGABYTE).toFixed(1)} MB</p>
            {status === 'UPLOADING' && (
               <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                  <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
                  Đang tải {progress}%
               </p>
            )}
            {isDone && (
               <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CircleCheck className="size-3.5" aria-hidden="true" />
                  Đã cập nhật vào phim
               </p>
            )}
            {!isDone && status !== 'UPLOADING' && (errorMessage ?? problem) && (
               <p
                  role="alert"
                  className={cn('mt-1 text-xs font-semibold', errorMessage ? 'text-danger-700' : 'text-ink-700')}
               >
                  {errorMessage ?? problem}
               </p>
            )}
            {!isDone && !problem && replacesExisting && (
               <span className="mt-1 inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-ink-800 ring-1 ring-amber-200">
                  Sẽ thay tệp hiện có
               </span>
            )}
         </div>
         <SelectField
            id={`media-movie-${key}`}
            label={`Phim cho tệp ${file.name}`}
            hideLabel
            placeholder="Chọn phim"
            value={mediaUploadItem.movieId}
            options={movieOptions}
            disabled={isLocked}
            onChange={(movieId) => onChange({ movieId })}
         />
         <SelectField
            id={`media-kind-${key}`}
            label={`Loại của tệp ${file.name}`}
            hideLabel
            placeholder="Chọn loại"
            value={mediaUploadItem.movieMediaKind}
            options={kindOptions}
            disabled={isLocked}
            onChange={(movieMediaKind) => onChange({ movieMediaKind: movieMediaKind as MovieMediaKind | '' })}
         />
         <Button
            variant="ghost"
            className="h-10 justify-self-end px-3"
            disabled={disabled}
            aria-label={`Bỏ tệp ${file.name}`}
            icon={<X className="size-4" aria-hidden="true" />}
            onClick={onRemove}
         />
      </li>
   );
}

export default MediaUploadRow;
