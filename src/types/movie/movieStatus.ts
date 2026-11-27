import type { MovieStatus } from '@/types/movie/movie';

export interface MovieStatusBulkRequest {
  movieIds: number[];
  status: MovieStatus;
}

export interface MovieStatusFailure {
  movieId: number;
  title: string;
  message: string;
}

export interface MovieStatusBulkResponse {
  updatedCount: number;
  failures: MovieStatusFailure[];
}
