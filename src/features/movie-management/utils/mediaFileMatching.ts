import { normalizeSearchText } from '@/lib/common/searchText';
import type { MediaPurpose } from '@/types/media/media';
import type { MovieMediaKind, MovieMediaRequest, MovieMediaTarget } from '@/types/movie/movieMedia';

export interface MediaFileMatch {
   movieId: string;
   movieMediaKind: MovieMediaKind | '';
}

export const MOVIE_MEDIA_KINDS: MovieMediaKind[] = ['POSTER', 'BANNER', 'TRAILER'];

export const MOVIE_MEDIA_KIND_LABELS: Record<MovieMediaKind, string> = {
   POSTER: 'Poster',
   BANNER: 'Banner',
   TRAILER: 'Trailer',
};

export const MOVIE_MEDIA_PURPOSES: Record<MovieMediaKind, MediaPurpose> = {
   POSTER: 'MOVIE_POSTER',
   BANNER: 'MOVIE_BANNER',
   TRAILER: 'MOVIE_TRAILER',
};

const IMAGE_EXTENSIONS: string[] = ['jpg', 'jpeg', 'png', 'webp'];
const VIDEO_EXTENSIONS: string[] = ['mp4', 'webm', 'mov'];
const KIND_SUFFIX_PATTERN: RegExp = /^(.*?)-?(poster|banner|trailer)$/;

export const MEDIA_FILE_ACCEPT: string = [...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS]
   .map((extension) => `.${extension}`)
   .join(',');

function getExtension(filename: string): string {
   return (filename.split('.').pop() ?? '').toLowerCase();
}

function toFileSlug(filename: string): string {
   return normalizeSearchText(filename.replace(/\.[^.]+$/, ''))
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
}

export function isKindAllowedForFile(movieMediaKind: MovieMediaKind, filename: string): boolean {
   const allowedExtensions: string[] = movieMediaKind === 'TRAILER' ? VIDEO_EXTENSIONS : IMAGE_EXTENSIONS;
   return allowedExtensions.includes(getExtension(filename));
}

export function matchMediaFile(filename: string, movieMediaTargets: MovieMediaTarget[]): MediaFileMatch {
   const fileSlug: string = toFileSlug(filename);
   const suffixMatch: RegExpExecArray | null = KIND_SUFFIX_PATTERN.exec(fileSlug);
   const movieSlug: string = suffixMatch ? suffixMatch[1] : fileSlug;
   const suffixKind: MovieMediaKind | '' = suffixMatch ? (suffixMatch[2].toUpperCase() as MovieMediaKind) : '';
   const fallbackKind: MovieMediaKind | '' = VIDEO_EXTENSIONS.includes(getExtension(filename)) ? 'TRAILER' : '';
   const movieMediaKind: MovieMediaKind | '' = suffixKind || fallbackKind;
   const movieMediaTarget: MovieMediaTarget | undefined = movieMediaTargets.find(
      (candidateMovieMediaTarget) => candidateMovieMediaTarget.slug === movieSlug,
   );
   return {
      movieId: movieMediaTarget ? String(movieMediaTarget.id) : '',
      movieMediaKind: movieMediaKind && isKindAllowedForFile(movieMediaKind, filename) ? movieMediaKind : '',
   };
}

export function getCurrentMediaUrl(movieMediaTarget: MovieMediaTarget, movieMediaKind: MovieMediaKind): string | null {
   if (movieMediaKind === 'POSTER') {
      return movieMediaTarget.posterUrl;
   }
   return movieMediaKind === 'BANNER' ? movieMediaTarget.bannerUrl : movieMediaTarget.trailerUrl;
}

export function toMovieMediaRequest(movieMediaKind: MovieMediaKind, mediaUrl: string): MovieMediaRequest {
   if (movieMediaKind === 'POSTER') {
      return { posterUrl: mediaUrl };
   }
   return movieMediaKind === 'BANNER' ? { bannerUrl: mediaUrl } : { trailerUrl: mediaUrl };
}
