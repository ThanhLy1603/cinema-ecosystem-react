import type { AxiosResponse } from 'axios';
import axiosInstance from '@/api/axiosClient';
import type { ApiResponse } from '@/types/common/api';
import type { MovieMediaRequest, MovieMediaTarget } from '@/types/movie/movieMedia';

export async function getMovieMediaTargets(): Promise<MovieMediaTarget[]> {
   const axiosResponse: AxiosResponse<ApiResponse<MovieMediaTarget[]>> =
      await axiosInstance.get<ApiResponse<MovieMediaTarget[]>>('/admin/movies/media-targets');
   return axiosResponse.data.data;
}

export async function updateMovieMedia(
   movieId: number,
   movieMediaRequest: MovieMediaRequest,
): Promise<MovieMediaTarget> {
   const axiosResponse: AxiosResponse<ApiResponse<MovieMediaTarget>> = await axiosInstance.patch<
      ApiResponse<MovieMediaTarget>
   >(`/admin/movies/${movieId}/media`, movieMediaRequest);
   return axiosResponse.data.data;
}
