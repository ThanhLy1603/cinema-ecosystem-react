import { useMutation, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { createCinema } from '@/api/cinema/cinemaApi';
import Modal from '@/components/common/Modal';
import { getErrorMessage, getFieldErrors } from '@/lib/common/apiError';
import type { CinemaDetail, CinemaRequest, Facility } from '@/types/cinema/cinema';
import { useCinemaRefresh } from '../hooks/useCinemaRefresh';
import { useFacilities } from '../hooks/useFacilities';
import CinemaForm from './CinemaForm';

interface CinemaCreateModalProps {
   onClose: () => void;
   onCreated: (cinemaDetail: CinemaDetail) => void;
}

export function CinemaCreateModal({ onClose, onCreated }: CinemaCreateModalProps): ReactElement {
   const refreshCinema: () => void = useCinemaRefresh(null);
   const facilitiesQuery: UseQueryResult<Facility[]> = useFacilities();

   function handleCreated(cinemaDetail: CinemaDetail): void {
      refreshCinema();
      onCreated(cinemaDetail);
   }

   const createMutation: UseMutationResult<CinemaDetail, unknown, CinemaRequest> = useMutation<
      CinemaDetail,
      unknown,
      CinemaRequest
   >({
      mutationFn: createCinema,
      onSuccess: handleCreated,
   });

   const serverFieldErrors: Record<string, string> = createMutation.isError ? getFieldErrors(createMutation.error) : {};
   const hasFieldErrors: boolean = Object.keys(serverFieldErrors).length > 0;

   return (
      <Modal title="Thêm cụm rạp" size="lg" isFlush isDismissDisabled={createMutation.isPending} onClose={onClose}>
         <div className="relative min-h-0 flex-1 space-y-4 overflow-y-auto p-5 focus-visible:outline-none">
            <p className="text-sm text-ink-500">Sau khi tạo, bạn có thể thêm phòng chiếu và sơ đồ ghế.</p>
            <CinemaForm
               hasStickyFooter
               facilities={facilitiesQuery.data ?? []}
               canEditStatus
               isSubmitting={createMutation.isPending}
               submitLabel="Tạo cụm rạp"
               errorMessage={
                  createMutation.isError && !hasFieldErrors ? getErrorMessage(createMutation.error) : undefined
               }
               serverFieldErrors={serverFieldErrors}
               onSubmit={(cinemaRequest) => createMutation.mutate(cinemaRequest)}
            />
         </div>
      </Modal>
   );
}

export default CinemaCreateModal;
