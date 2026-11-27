import { RotateCcw, Search } from 'lucide-react';
import { useEffect, useEffectEvent, useState, type FormEvent, type ReactElement } from 'react';
import Button from '@/components/ui/Button';
import SelectField, { type SelectOption } from '@/components/ui/SelectField';
import TextField from '@/components/ui/TextField';
import { AGE_RATING_FILTER_OPTIONS } from '@/lib/movie/movieLabels';
import type { Genre } from '@/types/movie/movie';
import { EMPTY_MOVIE_FILTERS, hasActiveMovieFilters, type AdminMovieFilters } from '../utils/filterParams';

const KEYWORD_DEBOUNCE_MS: number = 350;

interface MovieFilterBarProps {
   adminMovieFilters: AdminMovieFilters;
   genres: Genre[];
   onChange: (adminMovieFilters: AdminMovieFilters) => void;
}

export function MovieFilterBar({ adminMovieFilters, genres, onChange }: MovieFilterBarProps): ReactElement {
   const [keyword, setKeyword] = useState<string>(adminMovieFilters.keyword);
   const [syncedKeyword, setSyncedKeyword] = useState<string>(adminMovieFilters.keyword);
   const genreOptions: SelectOption[] = [
      { value: '', label: 'Tất cả thể loại' },
      ...genres.map((genre) => ({ value: String(genre.id), label: genre.name })),
   ];

   if (adminMovieFilters.keyword !== syncedKeyword) {
      setSyncedKeyword(adminMovieFilters.keyword);
      if (adminMovieFilters.keyword !== keyword.trim()) {
         setKeyword(adminMovieFilters.keyword);
      }
   }

   function applyKeyword(): void {
      const nextKeyword: string = keyword.trim();
      if (nextKeyword !== adminMovieFilters.keyword) {
         onChange({ ...adminMovieFilters, keyword: nextKeyword });
      }
   }

   const applyLatestKeyword: () => void = useEffectEvent(applyKeyword);

   useEffect((): (() => void) => {
      const timeoutId: ReturnType<typeof setTimeout> = setTimeout(
         (): void => applyLatestKeyword(),
         KEYWORD_DEBOUNCE_MS,
      );
      return (): void => clearTimeout(timeoutId);
   }, [keyword]);

   function handleSubmit(formEvent: FormEvent<HTMLFormElement>): void {
      formEvent.preventDefault();
      applyKeyword();
   }

   function handleSelectionChange(changes: Partial<AdminMovieFilters>): void {
      onChange({ ...adminMovieFilters, keyword: keyword.trim(), ...changes });
   }

   function handleReset(): void {
      setKeyword('');
      onChange(EMPTY_MOVIE_FILTERS);
   }

   return (
      <form
         onSubmit={handleSubmit}
         className="flex flex-col gap-3 rounded-lg bg-white px-2 py-4 shadow-card ring-1 ring-ink-200/80 sm:flex-row sm:flex-wrap sm:items-end sm:px-4 xl:flex-nowrap"
      >
         <div className="sm:w-full xl:w-auto xl:min-w-0 xl:flex-1">
            <TextField
               id="admin-movie-keyword"
               label="Tìm kiếm"
               value={keyword}
               onChange={setKeyword}
               icon={Search}
               placeholder="Tìm theo tên phim, thể loại, nghệ sĩ..."
               clearable
            />
         </div>
         <div className="sm:flex-1 xl:w-52 xl:flex-none">
            <SelectField
               id="admin-movie-genre-filter"
               label="Thể loại"
               value={adminMovieFilters.genreId}
               onChange={(genreId) => handleSelectionChange({ genreId })}
               options={genreOptions}
               placeholder="Tất cả thể loại"
            />
         </div>
         <div className="sm:flex-1 xl:w-44 xl:flex-none">
            <SelectField
               id="admin-movie-rated-filter"
               label="Độ tuổi"
               value={adminMovieFilters.rated}
               onChange={(rated) => handleSelectionChange({ rated })}
               options={AGE_RATING_FILTER_OPTIONS}
               placeholder="Mọi độ tuổi"
               searchable={false}
            />
         </div>
         {hasActiveMovieFilters(adminMovieFilters) && (
            <Button
               variant="secondary"
               icon={<RotateCcw className="size-4" aria-hidden="true" />}
               onClick={handleReset}
               className="shrink-0 self-end"
            >
               Đặt lại
            </Button>
         )}
      </form>
   );
}

export default MovieFilterBar;
