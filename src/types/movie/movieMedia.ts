import type { MovieStatus } from '@/types/movie/movie';

export type MovieMediaKind = 'POSTER' | 'BANNER' | 'TRAILER';

export interface MovieMediaTarget {
  id: number;
  title: string;
  slug: string;
  status: MovieStatus;
  posterUrl: string | null;
  bannerUrl: string | null;
  trailerUrl: string | null;
}

export interface MovieMediaRequest {
  posterUrl?: string;
  bannerUrl?: string;
  trailerUrl?: string;
}
