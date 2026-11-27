import { useQueryClient, type QueryClient, type UseQueryResult } from '@tanstack/react-query';
import { FileSpreadsheet, Plus, RotateCcw } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import { deleteGenre } from '@/api/movie/movieApi';
import { exportGenres } from '@/api/movie/movieExportApi';
import Modal from '@/components/common/Modal';
import Pagination from '@/components/common/Pagination';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/common/apiError';
import { normalizeSearchText } from '@/lib/common/searchText';
import { PUBLIC_MOVIES_KEY } from '@/lib/movie/movieQueryKeys';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Genre } from '@/types/movie/movie';
import CatalogImportModal from '../components/CatalogImportModal';
import CatalogRowActions from '../components/CatalogRowActions';
import CatalogTable, { type CatalogColumn } from '../components/CatalogTable';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import EmptyPanel from '../components/EmptyPanel';
import ExportExcelButton from '../components/ExportExcelButton';
import GenreForm from '../components/GenreForm';
import KeywordFilterBar from '../components/KeywordFilterBar';
import MovieSectionTabs from '../components/MovieSectionTabs';
import { useGenres } from '../hooks/useGenres';
import { useKeywordPageParams } from '../hooks/useKeywordPageParams';
import { ADMIN_GENRES_KEY } from '../utils/queryKeys';

type GenrePanelState = { mode: 'create' } | { mode: 'edit'; genre: Genre };

const PAGE_SIZE: number = 20;

const GENRE_COLUMNS: CatalogColumn<Genre>[] = [
   {
      header: 'Thể loại',
      align: 'left',
      render: (genre) => <span className="font-semibold text-ink-900">{genre.name}</span>,
   },
   { header: 'Đường dẫn', render: (genre) => <span className="break-all text-ink-500">/{genre.slug}</span> },
];

function matchesKeyword(genre: Genre, normalizedKeyword: string): boolean {
   return normalizeSearchText(genre.name).includes(normalizedKeyword) || genre.slug.includes(normalizedKeyword);
}

export function GenreManagementPage(): ReactElement {
   const isAdmin: boolean = useAuthStore((authState) => authState.hasRole('ROLE_ADMIN'));
   const queryClient: QueryClient = useQueryClient();
   const genresQuery: UseQueryResult<Genre[]> = useGenres();
   const { keyword, page, applyKeyword, changePage } = useKeywordPageParams();
   const [genrePanelState, setGenrePanelState] = useState<GenrePanelState | null>(null);
   const [pendingDeleteGenre, setPendingDeleteGenre] = useState<Genre | null>(null);
   const [successMessage, setSuccessMessage] = useState<string | null>(null);
   const [isImportOpen, setIsImportOpen] = useState<boolean>(false);

   const normalizedKeyword: string = normalizeSearchText(keyword);
   const matchedGenres: Genre[] = (genresQuery.data ?? []).filter((genre) => matchesKeyword(genre, normalizedKeyword));
   const totalPages: number = Math.ceil(matchedGenres.length / PAGE_SIZE);
   const currentPage: number = Math.min(page, Math.max(totalPages - 1, 0));
   const visibleGenres: Genre[] = matchedGenres.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

   function openPanel(nextGenrePanelState: GenrePanelState): void {
      setSuccessMessage(null);
      setGenrePanelState(nextGenrePanelState);
   }

   function closePanel(): void {
      setGenrePanelState(null);
   }

   function handleSaved(): void {
      setSuccessMessage(genrePanelState?.mode === 'edit' ? 'Đã cập nhật thể loại' : 'Đã thêm thể loại');
      closePanel();
   }

   function handleDeleted(): void {
      void queryClient.invalidateQueries({ queryKey: ADMIN_GENRES_KEY });
      void queryClient.invalidateQueries({ queryKey: PUBLIC_MOVIES_KEY });
      setPendingDeleteGenre(null);
      setSuccessMessage('Đã xóa thể loại');
   }

   function openImport(): void {
      setSuccessMessage(null);
      setIsImportOpen(true);
   }

   function renderActions(genre: Genre): ReactElement {
      return (
         <CatalogRowActions
            entityName={`thể loại ${genre.name}`}
            moviesPath={`/admin/movies?genreId=${genre.id}`}
            canDelete={isAdmin}
            onEdit={() => openPanel({ mode: 'edit', genre })}
            onDelete={() => setPendingDeleteGenre(genre)}
         />
      );
   }

   function renderEmptyState(): ReactElement {
      if (keyword) {
         return (
            <EmptyPanel message="Không có thể loại nào phù hợp với từ khóa.">
               <Button
                  variant="secondary"
                  icon={<RotateCcw className="size-4" aria-hidden="true" />}
                  onClick={() => applyKeyword('')}
               >
                  Xóa bộ lọc
               </Button>
            </EmptyPanel>
         );
      }
      return <EmptyPanel message="Danh mục thể loại đang trống." />;
   }

   return (
      <div className="w-full max-w-7xl space-y-5">
         <MovieSectionTabs />

         <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl font-bold text-ink-900">Danh mục thể loại</h1>
               <p className="mt-1 text-sm text-ink-500">
                  Gán thể loại cho từng phim khi thêm hoặc sửa phim. Chỉ quản trị viên mới được xóa thể loại.
               </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
               <ExportExcelButton filePrefix="danh-sach-the-loai" exportFile={() => exportGenres(keyword)} />
               <Button
                  variant="secondary"
                  icon={<FileSpreadsheet className="size-4" aria-hidden="true" />}
                  onClick={openImport}
               >
                  Nhập từ Excel
               </Button>
               <Button
                  icon={<Plus className="size-4" aria-hidden="true" />}
                  onClick={() => openPanel({ mode: 'create' })}
               >
                  Thêm thể loại
               </Button>
            </div>
         </header>

         <KeywordFilterBar
            id="admin-genre-keyword"
            placeholder="Tìm theo tên thể loại..."
            appliedKeyword={keyword}
            onApply={applyKeyword}
         />

         {successMessage && <Alert variant="success">{successMessage}</Alert>}
         {genresQuery.isError && <Alert variant="error">{getErrorMessage(genresQuery.error)}</Alert>}
         {genresQuery.isPending && <p className="text-sm text-ink-500">Đang tải danh sách...</p>}
         {genresQuery.data &&
            (matchedGenres.length === 0 ? (
               renderEmptyState()
            ) : (
               <>
                  <CatalogTable items={visibleGenres} catalogColumns={GENRE_COLUMNS} renderActions={renderActions} />
                  <Pagination
                     page={currentPage}
                     totalPages={totalPages}
                     totalElements={matchedGenres.length}
                     onPageChange={changePage}
                  />
               </>
            ))}

         {genrePanelState && (
            <Modal title={genrePanelState.mode === 'edit' ? 'Sửa thể loại' : 'Thêm thể loại'} onClose={closePanel}>
               <GenreForm
                  genre={genrePanelState.mode === 'edit' ? genrePanelState.genre : undefined}
                  onDone={handleSaved}
                  onCancel={closePanel}
               />
            </Modal>
         )}

         {pendingDeleteGenre && (
            <ConfirmDeleteDialog
               title="Xóa thể loại?"
               confirmLabel="Xóa thể loại"
               deleteEntity={() => deleteGenre(pendingDeleteGenre.id)}
               onClose={() => setPendingDeleteGenre(null)}
               onDeleted={handleDeleted}
            >
               Thể loại <strong className="text-ink-900">{pendingDeleteGenre.name}</strong> sẽ bị xóa vĩnh viễn. Chỉ xóa
               được khi chưa gán cho phim nào.
            </ConfirmDeleteDialog>
         )}

         {isImportOpen && <CatalogImportModal catalogImportType="genres" onClose={() => setIsImportOpen(false)} />}
      </div>
   );
}

export default GenreManagementPage;
