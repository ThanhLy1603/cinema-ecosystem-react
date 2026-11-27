import { X } from 'lucide-react';
import type { ReactElement } from 'react';
import SelectField, { type SelectOption } from '@/components/ui/SelectField';
import type { Genre } from '@/types/movie/movie';
import { MAX_GENRES } from '../utils/validation';

interface GenrePickerProps {
   genres: Genre[];
   selectedGenreIds: number[];
   onChange: (selectedGenreIds: number[]) => void;
}

function getPlaceholder(selectedCount: number, remainingCount: number): string {
   if (selectedCount >= MAX_GENRES) {
      return `Đã chọn tối đa ${MAX_GENRES} thể loại`;
   }
   return remainingCount === 0 ? 'Đã chọn hết thể loại' : 'Chọn thể loại...';
}

export function GenrePicker({ genres, selectedGenreIds, onChange }: GenrePickerProps): ReactElement {
   const selectedGenres: Genre[] = genres.filter((genre) => selectedGenreIds.includes(genre.id));
   const genreOptions: SelectOption[] = genres
      .filter((genre) => !selectedGenreIds.includes(genre.id))
      .map((genre) => ({ value: String(genre.id), label: genre.name }));

   function addGenre(genreId: string): void {
      if (genreId !== '') {
         onChange([...selectedGenreIds, Number(genreId)]);
      }
   }

   function removeGenre(genreId: number): void {
      onChange(selectedGenreIds.filter((selectedGenreId) => selectedGenreId !== genreId));
   }

   if (genres.length === 0) {
      return <p className="text-sm text-ink-500">Chưa có thể loại nào trong danh mục.</p>;
   }

   return (
      <div className="space-y-3">
         <SelectField
            id="movie-genres"
            label="Thể loại phim"
            hideLabel
            value=""
            options={genreOptions}
            placeholder={getPlaceholder(selectedGenres.length, genreOptions.length)}
            disabled={selectedGenres.length >= MAX_GENRES || genreOptions.length === 0}
            onChange={addGenre}
         />
         {selectedGenres.length > 0 && (
            <ul aria-label="Thể loại đã chọn" className="flex flex-wrap gap-2">
               {selectedGenres.map((genre) => (
                  <li
                     key={genre.id}
                     className="flex items-center gap-1.5 rounded-full border border-brand-400 bg-brand-50 py-1 pl-3 pr-1.5 text-sm font-medium text-brand-800"
                  >
                     {genre.name}
                     <button
                        type="button"
                        onClick={() => removeGenre(genre.id)}
                        aria-label={`Bỏ thể loại ${genre.name}`}
                        className="grid size-6 place-items-center rounded-full transition-colors hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
                     >
                        <X className="size-4" aria-hidden="true" />
                     </button>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}

export default GenrePicker;
