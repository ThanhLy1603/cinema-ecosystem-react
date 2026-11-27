import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosInstance from '@/api/axiosClient';
import type { ApiResponse } from '@/types/common/api';
import type {
   CatalogImportReport,
   CatalogImportType,
   ImportActions,
   ImportReport,
   MovieImportReport,
} from '@/types/movie/movieImport';

const MULTIPART_CONFIG: AxiosRequestConfig = { headers: { 'Content-Type': 'multipart/form-data' } };

function toFormData(file: File): FormData {
   const formData: FormData = new FormData();
   formData.append('file', file);
   return formData;
}

function createImportActions<TImportReport extends ImportReport>(basePath: string): ImportActions<TImportReport> {
   async function uploadForReport(path: string, file: File): Promise<TImportReport> {
      const axiosResponse: AxiosResponse<ApiResponse<TImportReport>> = await axiosInstance.post<
         ApiResponse<TImportReport>
      >(path, toFormData(file), MULTIPART_CONFIG);
      return axiosResponse.data.data;
   }

   return {
      async downloadTemplate(): Promise<Blob> {
         const axiosResponse: AxiosResponse<Blob> = await axiosInstance.get<Blob>(`${basePath}/template`, {
            responseType: 'blob',
         });
         return axiosResponse.data;
      },
      previewImport(file: File): Promise<TImportReport> {
         return uploadForReport(`${basePath}/preview`, file);
      },
      importRows(file: File): Promise<TImportReport> {
         return uploadForReport(basePath, file);
      },
      async exportRows(file: File, rowNumbers: number[]): Promise<Blob> {
         const axiosResponse: AxiosResponse<Blob> = await axiosInstance.post<Blob>(
            `${basePath}/rows`,
            toFormData(file),
            { ...MULTIPART_CONFIG, params: { rowNumbers: rowNumbers.join(',') }, responseType: 'blob' },
         );
         return axiosResponse.data;
      },
   };
}

export const movieImportActions: ImportActions<MovieImportReport> =
   createImportActions<MovieImportReport>('/admin/movies/import');

export const catalogImportActions: Record<CatalogImportType, ImportActions<CatalogImportReport>> = {
   genres: createImportActions<CatalogImportReport>('/admin/genres/import'),
   persons: createImportActions<CatalogImportReport>('/admin/persons/import'),
};
