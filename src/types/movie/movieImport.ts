import type { AgeRating, MovieStatus } from '@/types/movie/movie';

export type ImportRowStatus = 'VALID' | 'DUPLICATE' | 'ERROR' | 'CREATED';

export interface ImportRow {
  rowNumber: number;
  rowStatus: ImportRowStatus;
  errors: string[];
}

export interface ImportReport<TImportRow extends ImportRow = ImportRow> {
  totalRows: number;
  validRows: number;
  duplicateRows: number;
  errorRows: number;
  createdRows: number;
  rows: TImportRow[];
}

export interface MovieImportRow extends ImportRow {
  title: string;
  slug: string;
  durationMinutes: number | null;
  releaseDate: string | null;
  rated: AgeRating | null;
  status: MovieStatus | null;
  genreNames: string[];
  castCount: number;
  newPersonNames: string[];
}

export interface MovieImportReport extends ImportReport<MovieImportRow> {
  unmatchedCastErrors: string[];
}

export interface CatalogImportRow extends ImportRow {
  name: string;
  detail: string;
}

export type CatalogImportReport = ImportReport<CatalogImportRow>;

export type CatalogImportType = 'genres' | 'persons';

export interface ImportActions<TImportReport extends ImportReport> {
  downloadTemplate: () => Promise<Blob>;
  previewImport: (file: File) => Promise<TImportReport>;
  importRows: (file: File) => Promise<TImportReport>;
  exportRows: (file: File, rowNumbers: number[]) => Promise<Blob>;
}
