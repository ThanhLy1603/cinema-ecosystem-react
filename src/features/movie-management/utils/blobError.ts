import axios from 'axios';
import { getErrorMessage } from '@/lib/common/apiError';
import type { ApiResponse } from '@/types/common/api';

export async function readBlobErrorMessage(error: unknown): Promise<string> {
   if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
      try {
         const apiResponse: ApiResponse<unknown> = JSON.parse(await error.response.data.text()) as ApiResponse<unknown>;
         if (apiResponse.message) {
            return apiResponse.message;
         }
      } catch {
         return getErrorMessage(error);
      }
   }
   return getErrorMessage(error);
}
