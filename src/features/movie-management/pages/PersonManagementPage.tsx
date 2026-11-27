import {
   keepPreviousData,
   useQuery,
   useQueryClient,
   type QueryClient,
   type UseQueryResult,
} from '@tanstack/react-query';
import { Plus, RotateCcw, UserRound } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { deletePerson, searchAdminPersons } from '@/api/movie/movieApi';
import Modal from '@/components/common/Modal';
import Pagination from '@/components/common/Pagination';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/common/apiError';
import { useAuthStore } from '@/stores/useAuthStore';
import type { PageResponse } from '@/types/common/api';
import type { Person } from '@/types/movie/movie';
import CatalogRowActions from '../components/CatalogRowActions';
import CatalogTable, { type CatalogColumn } from '../components/CatalogTable';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import EmptyPanel from '../components/EmptyPanel';
import KeywordFilterBar from '../components/KeywordFilterBar';
import MovieSectionTabs from '../components/MovieSectionTabs';
import PersonForm from '../components/PersonForm';
import { useKeywordPageParams } from '../hooks/useKeywordPageParams';
import { ADMIN_PERSONS_KEY, PERSON_OPTIONS_KEY } from '../utils/queryKeys';

type PersonPanelState = { mode: 'create' } | { mode: 'edit'; person: Person };

const PAGE_SIZE: number = 20;

function renderPersonName(person: Person): ReactElement {
   return (
      <div className="flex items-center gap-3">
         {person.avatarUrl ? (
            <img src={person.avatarUrl} alt="" className="size-10 shrink-0 rounded-full object-cover" />
         ) : (
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-400">
               <UserRound className="size-5" aria-hidden="true" />
            </span>
         )}
         <span className="min-w-36 font-semibold text-ink-900">{person.name}</span>
      </div>
   );
}

const PERSON_COLUMNS: CatalogColumn<Person>[] = [
   { header: 'Nghệ sĩ', align: 'left', render: renderPersonName },
   {
      header: 'Tiểu sử',
      align: 'left',
      render: (person) => <span className="line-clamp-2 break-words text-ink-500">{person.bio}</span>,
   },
];

export function PersonManagementPage(): ReactElement {
   const isAdmin: boolean = useAuthStore((authState) => authState.hasRole('ROLE_ADMIN'));
   const queryClient: QueryClient = useQueryClient();
   const { keyword, page, applyKeyword, changePage, buildSearch } = useKeywordPageParams();
   const [personPanelState, setPersonPanelState] = useState<PersonPanelState | null>(null);
   const [pendingDeletePerson, setPendingDeletePerson] = useState<Person | null>(null);
   const [successMessage, setSuccessMessage] = useState<string | null>(null);
   const personsQuery: UseQueryResult<PageResponse<Person>> = useQuery<PageResponse<Person>>({
      queryKey: [...ADMIN_PERSONS_KEY, keyword, page],
      queryFn: () => searchAdminPersons(keyword || undefined, page, PAGE_SIZE),
      placeholderData: keepPreviousData,
   });

   const totalPages: number = personsQuery.data?.totalPages ?? 0;
   const isPageOutOfRange: boolean = !personsQuery.isPlaceholderData && totalPages > 0 && page >= totalPages;

   function openPanel(nextPersonPanelState: PersonPanelState): void {
      setSuccessMessage(null);
      setPersonPanelState(nextPersonPanelState);
   }

   function closePanel(): void {
      setPersonPanelState(null);
   }

   function handleSaved(): void {
      setSuccessMessage(personPanelState?.mode === 'edit' ? 'Đã cập nhật nghệ sĩ' : 'Đã thêm nghệ sĩ');
      closePanel();
   }

   function handleDeleted(): void {
      void queryClient.invalidateQueries({ queryKey: ADMIN_PERSONS_KEY });
      void queryClient.invalidateQueries({ queryKey: PERSON_OPTIONS_KEY });
      setPendingDeletePerson(null);
      setSuccessMessage('Đã xóa nghệ sĩ');
   }

   function renderActions(person: Person): ReactElement {
      return (
         <CatalogRowActions
            entityName={`nghệ sĩ ${person.name}`}
            moviesPath={`/admin/movies?${new URLSearchParams({ keyword: person.name }).toString()}`}
            canDelete={isAdmin}
            onEdit={() => openPanel({ mode: 'edit', person })}
            onDelete={() => setPendingDeletePerson(person)}
         />
      );
   }

   function renderEmptyState(): ReactElement {
      if (keyword) {
         return (
            <EmptyPanel message="Không có nghệ sĩ nào phù hợp với từ khóa.">
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
      return <EmptyPanel message="Chưa có nghệ sĩ nào trong hệ thống." />;
   }

   return (
      <div className="w-full max-w-7xl space-y-5">
         <MovieSectionTabs />

         <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl font-bold text-ink-900">Đạo diễn và diễn viên</h1>
               <p className="mt-1 text-sm text-ink-500">
                  Gán vai trò cho từng phim ở trang chỉnh sửa phim. Chỉ quản trị viên mới được xóa nghệ sĩ.
               </p>
            </div>
            <Button icon={<Plus className="size-4" aria-hidden="true" />} onClick={() => openPanel({ mode: 'create' })}>
               Thêm nghệ sĩ
            </Button>
         </header>

         <KeywordFilterBar
            id="admin-person-keyword"
            placeholder="Tìm theo tên nghệ sĩ..."
            appliedKeyword={keyword}
            onApply={applyKeyword}
         />

         {successMessage && <Alert variant="success">{successMessage}</Alert>}
         {personsQuery.isError && <Alert variant="error">{getErrorMessage(personsQuery.error)}</Alert>}
         {personsQuery.isPending && <p className="text-sm text-ink-500">Đang tải danh sách...</p>}
         {isPageOutOfRange && <Navigate to={{ search: buildSearch(keyword, totalPages - 1) }} replace />}
         {personsQuery.data &&
            !isPageOutOfRange &&
            (personsQuery.data.content.length === 0 ? (
               renderEmptyState()
            ) : (
               <>
                  <CatalogTable
                     items={personsQuery.data.content}
                     catalogColumns={PERSON_COLUMNS}
                     renderActions={renderActions}
                  />
                  <Pagination
                     page={personsQuery.data.page}
                     totalPages={personsQuery.data.totalPages}
                     totalElements={personsQuery.data.totalElements}
                     onPageChange={changePage}
                  />
               </>
            ))}

         {personPanelState && (
            <Modal title={personPanelState.mode === 'edit' ? 'Sửa nghệ sĩ' : 'Thêm nghệ sĩ'} onClose={closePanel}>
               <PersonForm
                  person={personPanelState.mode === 'edit' ? personPanelState.person : undefined}
                  onDone={handleSaved}
                  onCancel={closePanel}
               />
            </Modal>
         )}

         {pendingDeletePerson && (
            <ConfirmDeleteDialog
               title="Xóa nghệ sĩ?"
               confirmLabel="Xóa nghệ sĩ"
               deleteEntity={() => deletePerson(pendingDeletePerson.id)}
               onClose={() => setPendingDeletePerson(null)}
               onDeleted={handleDeleted}
            >
               Nghệ sĩ <strong className="text-ink-900">{pendingDeletePerson.name}</strong> sẽ bị xóa vĩnh viễn. Chỉ xóa
               được khi chưa tham gia phim nào.
            </ConfirmDeleteDialog>
         )}
      </div>
   );
}

export default PersonManagementPage;
