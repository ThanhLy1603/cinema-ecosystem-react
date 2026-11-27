import type { ReactElement } from 'react';
import { formatReleaseDate } from '@/lib/movie/movieFormat';
import { AGE_RATING_DESCRIPTIONS, MOVIE_STATUS_LABELS } from '@/lib/movie/movieLabels';
import { cn } from '@/lib/common/utils';
import type { MovieImportRow } from '@/types/movie/movieImport';
import ImportStatusBadge from './ImportStatusBadge';

interface MovieImportRowTableProps {
   movieImportRows: MovieImportRow[];
}

const CELL_CLASSES: string = 'px-4 py-3 align-top';

function describeMovie(movieImportRow: MovieImportRow): string {
   return [
      movieImportRow.durationMinutes === null ? null : `${movieImportRow.durationMinutes} phút`,
      movieImportRow.releaseDate === null ? null : formatReleaseDate(movieImportRow.releaseDate),
      movieImportRow.rated === null ? null : AGE_RATING_DESCRIPTIONS[movieImportRow.rated],
      movieImportRow.status === null ? null : MOVIE_STATUS_LABELS[movieImportRow.status],
      ...movieImportRow.genreNames,
      movieImportRow.castCount === 0 ? null : `${movieImportRow.castCount} nghệ sĩ`,
   ]
      .filter(Boolean)
      .join(' · ');
}

export function MovieImportRowTable({ movieImportRows }: MovieImportRowTableProps): ReactElement {
   return (
      <div className="overflow-x-auto rounded-xl ring-1 ring-ink-200">
         <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-ink-50 text-xs text-ink-500">
               <tr>
                  <th className={CELL_CLASSES}>Dòng</th>
                  <th className={CELL_CLASSES}>Phim</th>
                  <th className={CELL_CLASSES}>Kết quả</th>
                  <th className={CELL_CLASSES}>Ghi chú</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
               {movieImportRows.map((movieImportRow) => (
                  <tr key={movieImportRow.rowNumber}>
                     <td className={cn(CELL_CLASSES, 'text-ink-500')}>{movieImportRow.rowNumber}</td>
                     <td className={cn(CELL_CLASSES, 'max-w-sm')}>
                        <p className="font-semibold text-ink-900">{movieImportRow.title || 'Chưa có tên'}</p>
                        <p className="text-xs text-ink-500">{describeMovie(movieImportRow)}</p>
                     </td>
                     <td className={CELL_CLASSES}>
                        <ImportStatusBadge importRowStatus={movieImportRow.rowStatus} />
                     </td>
                     <td className={cn(CELL_CLASSES, 'text-ink-700')}>
                        {movieImportRow.errors.map((errorMessage) => (
                           <p key={errorMessage}>{errorMessage}</p>
                        ))}
                        {movieImportRow.errors.length === 0 &&
                           movieImportRow.rowStatus !== 'DUPLICATE' &&
                           movieImportRow.newPersonNames.length > 0 && (
                              <p>
                                 {movieImportRow.rowStatus === 'CREATED' ? 'Đã tạo' : 'Sẽ tạo'} nghệ sĩ mới:{' '}
                                 <strong>{movieImportRow.newPersonNames.join(', ')}</strong>
                              </p>
                           )}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default MovieImportRowTable;
