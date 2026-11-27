import { useMutation, useQuery, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { getAdminCinema, updateCinema } from '@/api/cinema/cinemaApi';
import Modal from '@/components/common/Modal';
import SectionCard from '@/components/common/SectionCard';
import Alert from '@/components/ui/Alert';
import { getErrorMessage, getFieldErrors } from '@/lib/common/apiError';
import { useAuthStore } from '@/stores/useAuthStore';
import type { CinemaDetail, CinemaRequest, Facility } from '@/types/cinema/cinema';
import CinemaForm from './CinemaForm';
import CinemaStatusBadge from './CinemaStatusBadge';
import DeleteCinemaCard from './DeleteCinemaCard';
import HallSection from './HallSection';
import { useCinemaRefresh } from '../hooks/useCinemaRefresh';
import { useFacilities } from '../hooks/useFacilities';
import { adminCinemaDetailKey } from '../utils/queryKeys';

interface CinemaDetailModalProps {
   cinemaId: number;
   isNewlyCreated: boolean;
   onOpenSeatMap: (hallId: number) => void;
   onClose: () => void;
}

export function CinemaDetailModal({
   cinemaId,
   isNewlyCreated,
   onOpenSeatMap,
   onClose,
}: CinemaDetailModalProps): ReactElement {
   const isAdmin: boolean = useAuthStore((authState) => authState.hasRole('ROLE_ADMIN'));
   const refreshCinema: () => void = useCinemaRefresh(cinemaId);
   const facilitiesQuery: UseQueryResult<Facility[]> = useFacilities();
   const cinemaQuery: UseQueryResult<CinemaDetail> = useQuery<CinemaDetail>({
      queryKey: adminCinemaDetailKey(cinemaId),
      queryFn: () => getAdminCinema(cinemaId),
   });

   const updateMutation: UseMutationResult<CinemaDetail, unknown, CinemaRequest> = useMutation<
      CinemaDetail,
      unknown,
      CinemaRequest
   >({
      mutationFn: (cinemaRequest) => updateCinema(cinemaId, cinemaRequest),
      onSuccess: refreshCinema,
   });

   function handleSubmit(cinemaRequest: CinemaRequest): void {
      updateMutation.reset();
      updateMutation.mutate(cinemaRequest);
   }

   function renderContent(): ReactElement {
      if (cinemaQuery.isPending) {
         return <p className="py-10 text-center text-sm text-ink-500">Đang tải thông tin cụm rạp...</p>;
      }
      if (cinemaQuery.isError) {
         return <Alert variant="error">{getErrorMessage(cinemaQuery.error)}</Alert>;
      }

      const cinemaDetail: CinemaDetail = cinemaQuery.data;
      const serverFieldErrors: Record<string, string> = updateMutation.isError
         ? getFieldErrors(updateMutation.error)
         : {};
      const hasFieldErrors: boolean = Object.keys(serverFieldErrors).length > 0;

      return (
         <div className="space-y-5">
            <header className="flex flex-wrap items-center justify-between gap-3">
               <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-ink-900">{cinemaDetail.name}</h3>
                  <CinemaStatusBadge cinemaStatus={cinemaDetail.status} />
               </div>
               {cinemaDetail.status === 'ACTIVE' && (
                  <Link
                     to={`/cinemas/${cinemaDetail.slug}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
                  >
                     Xem trang khách hàng
                     <ExternalLink className="size-4" aria-hidden="true" />
                  </Link>
               )}
            </header>

            {isNewlyCreated && <Alert variant="success">Đã tạo cụm rạp. Bạn có thể thêm phòng chiếu ở bên dưới.</Alert>}

            <SectionCard title="Thông tin cụm rạp">
               <CinemaForm
                  key={`${cinemaDetail.id}-${cinemaDetail.name}-${cinemaDetail.status}`}
                  initialCinema={cinemaDetail}
                  facilities={facilitiesQuery.data ?? []}
                  canEditStatus={isAdmin}
                  isSubmitting={updateMutation.isPending}
                  submitLabel="Lưu thay đổi"
                  errorMessage={
                     updateMutation.isError && !hasFieldErrors ? getErrorMessage(updateMutation.error) : undefined
                  }
                  successMessage={updateMutation.isSuccess ? 'Đã cập nhật thông tin cụm rạp.' : undefined}
                  serverFieldErrors={serverFieldErrors}
                  onSubmit={handleSubmit}
               />
            </SectionCard>

            <SectionCard title="Phòng chiếu" description="Thêm phòng chiếu rồi thiết kế sơ đồ ghế cho từng phòng.">
               <HallSection cinemaId={cinemaDetail.id} halls={cinemaDetail.halls} onOpenSeatMap={onOpenSeatMap} />
            </SectionCard>

            {isAdmin && (
               <SectionCard title="Xóa cụm rạp">
                  <DeleteCinemaCard cinemaId={cinemaDetail.id} onDeleted={onClose} />
               </SectionCard>
            )}
         </div>
      );
   }

   return (
      <Modal
         title="Chi tiết cụm rạp"
         size="wide"
         isFlush
         isDismissDisabled={updateMutation.isPending}
         onClose={onClose}
      >
         <div className="relative min-h-0 flex-1 overflow-y-auto bg-ink-50 p-5 focus-visible:outline-none">
            {renderContent()}
         </div>
      </Modal>
   );
}

export default CinemaDetailModal;
