import { useState } from 'react';
import { getUploadErrorMessage, uploadPendingMedia } from '@/api/media/mediaApi';
import { updateMovieMedia } from '@/api/movie/movieMediaApi';
import type { MovieMediaKind, MovieMediaTarget } from '@/types/movie/movieMedia';
import {
   matchMediaFile,
   MOVIE_MEDIA_PURPOSES,
   toMovieMediaRequest,
   type MediaFileMatch,
} from '../utils/mediaFileMatching';

export type MediaUploadStatus = 'WAITING' | 'UPLOADING' | 'DONE' | 'FAILED';

export interface MediaUploadItem extends MediaFileMatch {
   key: string;
   file: File;
   status: MediaUploadStatus;
   progress: number;
   uploadedUrl: string | null;
   errorMessage: string | null;
}

export interface BulkMediaUpload {
   mediaUploadItems: MediaUploadItem[];
   isUploading: boolean;
   addFiles(files: File[], movieMediaTargets: MovieMediaTarget[]): void;
   changeMatch(key: string, mediaFileMatch: Partial<MediaFileMatch>): void;
   removeItem(key: string): void;
   clearUploaded(): void;
   uploadItems(readyMediaUploadItems: MediaUploadItem[]): Promise<void>;
}

const PARALLEL_UPLOADS: number = 3;

export function useBulkMediaUpload(onFinished: () => void): BulkMediaUpload {
   const [mediaUploadItems, setMediaUploadItems] = useState<MediaUploadItem[]>([]);
   const [isUploading, setIsUploading] = useState<boolean>(false);

   function patchItem(key: string, changes: Partial<MediaUploadItem>): void {
      setMediaUploadItems((previousMediaUploadItems) =>
         previousMediaUploadItems.map((mediaUploadItem) =>
            mediaUploadItem.key === key ? { ...mediaUploadItem, ...changes } : mediaUploadItem,
         ),
      );
   }

   function addFiles(files: File[], movieMediaTargets: MovieMediaTarget[]): void {
      const addedMediaUploadItems: MediaUploadItem[] = files.map((file): MediaUploadItem => ({
         ...matchMediaFile(file.name, movieMediaTargets),
         key: crypto.randomUUID(),
         file,
         status: 'WAITING',
         progress: 0,
         uploadedUrl: null,
         errorMessage: null,
      }));
      setMediaUploadItems((previousMediaUploadItems) => [...previousMediaUploadItems, ...addedMediaUploadItems]);
   }

   function changeMatch(key: string, mediaFileMatch: Partial<MediaFileMatch>): void {
      patchItem(key, { ...mediaFileMatch, status: 'WAITING', uploadedUrl: null, errorMessage: null });
   }

   function removeItem(key: string): void {
      setMediaUploadItems((previousMediaUploadItems) =>
         previousMediaUploadItems.filter((mediaUploadItem) => mediaUploadItem.key !== key),
      );
   }

   function clearUploaded(): void {
      setMediaUploadItems((previousMediaUploadItems) =>
         previousMediaUploadItems.filter((mediaUploadItem) => mediaUploadItem.status !== 'DONE'),
      );
   }

   async function uploadItem(mediaUploadItem: MediaUploadItem): Promise<void> {
      const movieMediaKind: MovieMediaKind = mediaUploadItem.movieMediaKind as MovieMediaKind;
      patchItem(mediaUploadItem.key, { status: 'UPLOADING', progress: 0, errorMessage: null });
      try {
         const uploadedUrl: string =
            mediaUploadItem.uploadedUrl ??
            (await uploadPendingMedia(
               { url: '', file: mediaUploadItem.file },
               MOVIE_MEDIA_PURPOSES[movieMediaKind],
               (progress) => patchItem(mediaUploadItem.key, { progress }),
            ));
         patchItem(mediaUploadItem.key, { uploadedUrl });
         await updateMovieMedia(Number(mediaUploadItem.movieId), toMovieMediaRequest(movieMediaKind, uploadedUrl));
         patchItem(mediaUploadItem.key, { status: 'DONE', progress: 100 });
      } catch (error: unknown) {
         patchItem(mediaUploadItem.key, { status: 'FAILED', errorMessage: getUploadErrorMessage(error) });
      }
   }

   async function uploadItems(readyMediaUploadItems: MediaUploadItem[]): Promise<void> {
      const queuedMediaUploadItems: MediaUploadItem[] = [...readyMediaUploadItems];

      async function drainQueue(): Promise<void> {
         let mediaUploadItem: MediaUploadItem | undefined = queuedMediaUploadItems.shift();
         while (mediaUploadItem) {
            await uploadItem(mediaUploadItem);
            mediaUploadItem = queuedMediaUploadItems.shift();
         }
      }

      setIsUploading(true);
      await Promise.all(Array.from({ length: PARALLEL_UPLOADS }, drainQueue));
      setIsUploading(false);
      onFinished();
   }

   return { mediaUploadItems, isUploading, addFiles, changeMatch, removeItem, clearUploaded, uploadItems };
}
