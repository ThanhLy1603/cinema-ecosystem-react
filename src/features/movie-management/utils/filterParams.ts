import { ADMIN_MOVIE_STATUSES, AGE_RATINGS } from '@/lib/movie/movieLabels';

export interface AdminMovieFilters {
   keyword: string;
   genreId: string;
   status: string;
   rated: string;
   deleted: string;
}

export const EMPTY_MOVIE_FILTERS: AdminMovieFilters = {
   keyword: '',
   genreId: '',
   status: '',
   rated: '',
   deleted: '',
};

const PAGE_PARAM: string = 'page';

function parsePositiveInteger(value: string | null): number {
   const parsedValue: number = Number(value);
   return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : 0;
}

export function parseMovieFilters(searchParams: URLSearchParams, canViewDeleted: boolean): AdminMovieFilters {
   const isDeletedView: boolean = canViewDeleted && searchParams.get('deleted') === 'true';
   const genreId: number = parsePositiveInteger(searchParams.get('genreId'));
   return {
      keyword: searchParams.get('keyword')?.trim() ?? '',
      genreId: genreId > 0 ? String(genreId) : '',
      status: isDeletedView
         ? ''
         : (ADMIN_MOVIE_STATUSES.find((movieStatus) => movieStatus === searchParams.get('status')) ?? ''),
      rated: AGE_RATINGS.find((ageRating) => ageRating === searchParams.get('rated')) ?? '',
      deleted: isDeletedView ? 'true' : '',
   };
}

export function parseMoviePage(searchParams: URLSearchParams): number {
   return Math.max(parsePositiveInteger(searchParams.get(PAGE_PARAM)) - 1, 0);
}

export function buildMovieSearchParams(adminMovieFilters: AdminMovieFilters, page: number): URLSearchParams {
   const urlSearchParams: URLSearchParams = new URLSearchParams();
   Object.entries(adminMovieFilters).forEach(([filterName, filterValue]: [string, string]): void => {
      if (filterValue) {
         urlSearchParams.set(filterName, filterValue);
      }
   });
   if (page > 0) {
      urlSearchParams.set(PAGE_PARAM, String(page + 1));
   }
   return urlSearchParams;
}

export function hasActiveMovieFilters(adminMovieFilters: AdminMovieFilters): boolean {
   return Object.values(adminMovieFilters).some((filterValue) => filterValue !== '');
}
