import type { AxiosResponse } from 'axios';
import axiosInstance from '@/api/axiosClient';
import type { AdminMovieSearchParams } from '@/types/movie/movie';

async function downloadExport(path: string, params: object): Promise<Blob> {
   const axiosResponse: AxiosResponse<Blob> = await axiosInstance.get<Blob>(path, { params, responseType: 'blob' });
   return axiosResponse.data;
}

export function exportMovies(adminMovieSearchParams: AdminMovieSearchParams): Promise<Blob> {
   const { keyword, genreId, status, rated, deleted } = adminMovieSearchParams;
   return downloadExport('/admin/movies/export', { keyword, genreId, status, rated, deleted });
}

export function exportGenres(keyword: string): Promise<Blob> {
   return downloadExport('/admin/genres/export', { keyword: keyword || undefined });
}

export function exportPersons(keyword: string): Promise<Blob> {
   return downloadExport('/admin/persons/export', { keyword: keyword || undefined });
}
