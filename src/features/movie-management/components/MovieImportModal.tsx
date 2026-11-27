import { Images } from 'lucide-react';
import type { ReactElement } from 'react';
import { movieImportActions } from '@/api/movie/movieImportApi';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import type { MovieImportReport } from '@/types/movie/movieImport';
import { useMovieRefresh } from '../hooks/useMovieRefresh';
import ExcelImportModal from './ExcelImportModal';
import MovieImportRowTable from './MovieImportRowTable';

interface MovieImportModalProps {
   onClose: () => void;
   onOpenMedia: () => void;
}

function renderMovieRows(movieImportReport: MovieImportReport): ReactElement {
   return (
      <>
         {movieImportReport.unmatchedCastErrors.length > 0 && (
            <Alert variant="error">
               {movieImportReport.unmatchedCastErrors.map((unmatchedCastError) => (
                  <span key={unmatchedCastError} className="block">
                     {unmatchedCastError}
                  </span>
               ))}
            </Alert>
         )}
         <MovieImportRowTable movieImportRows={movieImportReport.rows} />
      </>
   );
}

export function MovieImportModal({ onClose, onOpenMedia }: MovieImportModalProps): ReactElement {
   const refreshMovies: () => void = useMovieRefresh(null);

   return (
      <ExcelImportModal<MovieImportReport>
         title="Nhập phim từ Excel"
         description="Điền phim ở sheet Phim, người tham gia ở sheet Đạo diễn và diễn viên. Dòng mẫu không được nhập."
         itemName="phim"
         maxRows={200}
         templateFilename="mau-nhap-phim.xlsx"
         importActions={movieImportActions}
         renderRows={renderMovieRows}
         importedAction={
            <Button icon={<Images className="size-4" aria-hidden="true" />} onClick={onOpenMedia}>
               Tải ảnh và trailer
            </Button>
         }
         onImported={refreshMovies}
         onClose={onClose}
      />
   );
}

export default MovieImportModal;
