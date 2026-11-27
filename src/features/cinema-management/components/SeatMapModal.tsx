import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useState, type ReactElement } from 'react';
import { getSeatMap } from '@/api/cinema/hallApi';
import Modal from '@/components/common/Modal';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/common/apiError';
import { useSeatTypes } from '@/lib/cinema/useSeatTypes';
import type { SeatLayout, SeatType } from '@/types/cinema/cinema';
import { adminSeatMapKey } from '../utils/queryKeys';
import CinemaStatusBadge from './CinemaStatusBadge';
import SeatMapEditor from './SeatMapEditor';

interface SeatMapModalProps {
   hallId: number;
   onClose: () => void;
}

export function SeatMapModal({ hallId, onClose }: SeatMapModalProps): ReactElement {
   const [isDirty, setIsDirty] = useState<boolean>(false);
   const [isConfirmingClose, setIsConfirmingClose] = useState<boolean>(false);
   const seatTypesQuery: UseQueryResult<SeatType[]> = useSeatTypes();
   const seatMapQuery: UseQueryResult<SeatLayout> = useQuery<SeatLayout>({
      queryKey: adminSeatMapKey(hallId),
      queryFn: () => getSeatMap(hallId),
      gcTime: 0,
      staleTime: 0,
   });

   function requestClose(): void {
      if (isDirty) {
         setIsConfirmingClose(true);
         return;
      }
      onClose();
   }

   function renderContent(): ReactElement {
      if (seatMapQuery.isPending || seatTypesQuery.isPending) {
         return <p className="py-10 text-center text-sm text-ink-500">Đang tải sơ đồ ghế...</p>;
      }
      if (seatMapQuery.isError || seatTypesQuery.isError) {
         return <Alert variant="error">{getErrorMessage(seatMapQuery.error ?? seatTypesQuery.error)}</Alert>;
      }
      const seatLayout: SeatLayout = seatMapQuery.data;
      return (
         <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
               <h3 className="text-lg font-bold text-ink-900">{seatLayout.hallName}</h3>
               <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-bold text-ink-700">
                  {seatLayout.screenType}
               </span>
               <CinemaStatusBadge hallStatus={seatLayout.hallStatus} />
            </div>
            <SeatMapEditor seatLayout={seatLayout} seatTypes={seatTypesQuery.data} onDirtyChange={setIsDirty} />
         </div>
      );
   }

   return (
      <Modal title="Sơ đồ ghế" size="full" isFlush onClose={requestClose}>
         {isConfirmingClose && (
            <div
               role="alertdialog"
               aria-label="Sơ đồ chưa được lưu"
               className="flex flex-wrap items-center gap-3 border-b border-danger-200 bg-danger-50 px-5 py-3 text-sm text-danger-800"
            >
               <span className="min-w-0 flex-1 font-semibold">Sơ đồ có thay đổi chưa lưu. Đóng và bỏ thay đổi?</span>
               <Button variant="destructive" className="h-9 px-4" onClick={onClose}>
                  Bỏ thay đổi và đóng
               </Button>
               <Button variant="ghost" className="h-9 px-4" onClick={() => setIsConfirmingClose(false)}>
                  Tiếp tục chỉnh sửa
               </Button>
            </div>
         )}
         <div className="relative min-h-0 flex-1 overflow-y-auto bg-ink-50 p-5 focus-visible:outline-none">
            {renderContent()}
         </div>
      </Modal>
   );
}

export default SeatMapModal;
