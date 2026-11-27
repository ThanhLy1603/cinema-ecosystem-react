import { RotateCcw, Search } from 'lucide-react';
import type { FormEvent, ReactElement } from 'react';
import Button from '@/components/ui/Button';
import SelectField, { type SelectOption } from '@/components/ui/SelectField';
import TextField from '@/components/ui/TextField';
import { AGE_RATING_FILTER_OPTIONS } from '@/lib/movie/movieLabels';
import type { Genre } from '@/types/movie/movie';
import { useDebouncedKeyword } from '../hooks/useDebouncedKeyword';
import { EMPTY_MOVIE_FILTERS, hasActiveMovieFilters, type AdminMovieFilters } from '../utils/filterParams';

interface MovieFilterBarProps {
   adminMovieFilters: AdminMovieFilters;
   genres: Genre[];
   onChange: (adminMovieFilters: AdminMovieFilters) => void;
}

export function MovieFilterBar({ adminMovieFilters, genres, onChange }: MovieFilterBarProps): ReactElement {
   const { typedKeyword, setTypedKeyword, applyKeyword } = useDebouncedKeyword(adminMovieFilters.keyword, (keyword) =>
      onChange({ ...adminMovieFilters, keyword }),
   );
   const genreOptions: SelectOption[] = [
      { value: '', label: 'Tất cả thể loại' },
      ...genres.map((genre) => ({ value: String(genre.id), label: genre.name })),
   ];

   function handleSubmit(formEvent: FormEvent<HTMLFormElement>): void {
      formEvent.preventDefault();
      applyKeyword();
   }

   function handleSelectionChange(changes: Partial<AdminMovieFilters>): void {
      onChange({ ...adminMovieFilters, keyword: typedKeyword.trim(), ...changes });
   }

   function handleReset(): void {
      setTypedKeyword('');
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
               value={typedKeyword}
               onChange={setTypedKeyword}
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
