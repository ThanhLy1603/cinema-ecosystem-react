import type { AxiosResponse } from 'axios';
import axiosInstance from '@/api/axiosClient';
import type { ApiResponse } from '@/types/common/api';
import type { MovieStatusBulkRequest, MovieStatusBulkResponse } from '@/types/movie/movieStatus';

export async function changeMovieStatuses(
   movieStatusBulkRequest: MovieStatusBulkRequest,
): Promise<MovieStatusBulkResponse> {
   const axiosResponse: AxiosResponse<ApiResponse<MovieStatusBulkResponse>> = await axiosInstance.patch<
      ApiResponse<MovieStatusBulkResponse>
   >('/admin/movies/status', movieStatusBulkRequest);
   return axiosResponse.data.data;
}
