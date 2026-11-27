import { useSearchParams, type SetURLSearchParams } from 'react-router-dom';

export interface KeywordPageParams {
   keyword: string;
   page: number;
   applyKeyword: (keyword: string) => void;
   changePage: (page: number) => void;
   buildSearch: (keyword: string, page: number) => string;
}

function buildKeywordSearchParams(keyword: string, page: number): URLSearchParams {
   const urlSearchParams: URLSearchParams = new URLSearchParams();
   if (keyword) {
      urlSearchParams.set('keyword', keyword);
   }
   if (page > 0) {
      urlSearchParams.set('page', String(page + 1));
   }
   return urlSearchParams;
}

export function useKeywordPageParams(): KeywordPageParams {
   const [searchParams, setSearchParams]: [URLSearchParams, SetURLSearchParams] = useSearchParams();
   const keyword: string = searchParams.get('keyword')?.trim() ?? '';
   const pageNumber: number = Number(searchParams.get('page'));
   const page: number = Number.isInteger(pageNumber) && pageNumber > 1 ? pageNumber - 1 : 0;

   function applyKeyword(nextKeyword: string): void {
      setSearchParams(buildKeywordSearchParams(nextKeyword, 0), { replace: true });
   }

   function changePage(nextPage: number): void {
      setSearchParams(buildKeywordSearchParams(keyword, nextPage), { replace: true });
   }

   function buildSearch(nextKeyword: string, nextPage: number): string {
      return buildKeywordSearchParams(nextKeyword, nextPage).toString();
   }

   return { keyword, page, applyKeyword, changePage, buildSearch };
}
