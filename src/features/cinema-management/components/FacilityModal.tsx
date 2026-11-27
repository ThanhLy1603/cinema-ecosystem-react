import type { UseQueryResult } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import Modal from '@/components/common/Modal';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import SelectField from '@/components/ui/SelectField';
import { getErrorMessage } from '@/lib/common/apiError';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Facility } from '@/types/cinema/cinema';
import { DELETED_FILTER_OPTIONS } from '../utils/labels';
import FacilityForm from './FacilityForm';
import FacilityRow from './FacilityRow';
import { useFacilities } from '../hooks/useFacilities';

interface FacilityModalProps {
   onClose: () => void;
}

export function FacilityModal({ onClose }: FacilityModalProps): ReactElement {
   const isAdmin: boolean = useAuthStore((authState) => authState.hasRole('ROLE_ADMIN'));
   const [isShowingDeleted, setIsShowingDeleted] = useState<boolean>(false);
   const facilitiesQuery: UseQueryResult<Facility[]> = useFacilities(isShowingDeleted);
   const [editingFacilityId, setEditingFacilityId] = useState<number | null>(null);
   const [isCreating, setIsCreating] = useState<boolean>(false);

   function closeForms(): void {
      setEditingFacilityId(null);
      setIsCreating(false);
   }

   function startEditing(facilityId: number): void {
      setIsCreating(false);
      setEditingFacilityId(facilityId);
   }

   function startCreating(): void {
      setEditingFacilityId(null);
      setIsCreating(true);
   }

   return (
      <Modal title="Danh mục tiện ích" size="lg" isFlush onClose={onClose}>
         <div className="relative min-h-0 flex-1 space-y-4 overflow-y-auto p-5 focus-visible:outline-none">
            <p className="text-sm text-ink-500">
               {isAdmin
                  ? 'Bãi đỗ xe, phòng VIP, khu vui chơi... Gán tiện ích khi thêm hoặc sửa cụm rạp.'
                  : 'Chỉ quản trị viên mới được thêm, sửa hoặc xóa tiện ích.'}
            </p>
            {isAdmin && (
               <div className="max-w-xs">
                  <SelectField
                     id="facility-deleted-filter"
                     label="Hiển thị"
                     value={isShowingDeleted ? 'true' : ''}
                     onChange={(deleted) => setIsShowingDeleted(deleted === 'true')}
                     options={DELETED_FILTER_OPTIONS}
                     placeholder="Đang sử dụng"
                  />
               </div>
            )}
            {facilitiesQuery.isError && <Alert variant="error">{getErrorMessage(facilitiesQuery.error)}</Alert>}
            {facilitiesQuery.isPending && <p className="text-sm text-ink-500">Đang tải danh mục...</p>}
            <ul className="space-y-3">
               {facilitiesQuery.data?.map((facility) =>
                  editingFacilityId === facility.id ? (
                     <li key={facility.id}>
                        <FacilityForm facility={facility} onDone={closeForms} onCancel={closeForms} />
                     </li>
                  ) : (
                     <FacilityRow key={facility.id} facility={facility} canManage={isAdmin} onEdit={startEditing} />
                  ),
               )}
            </ul>
            {facilitiesQuery.data?.length === 0 && (
               <p className="rounded-2xl bg-ink-50 px-4 py-6 text-center text-sm text-ink-500">
                  Danh mục tiện ích đang trống.
               </p>
            )}
            {isAdmin &&
               !isShowingDeleted &&
               (isCreating ? (
                  <FacilityForm onDone={closeForms} onCancel={closeForms} />
               ) : (
                  <Button
                     variant="secondary"
                     icon={<Plus className="size-4" aria-hidden="true" />}
                     onClick={startCreating}
                  >
                     Thêm tiện ích
                  </Button>
               ))}
         </div>
      </Modal>
   );
}

export default FacilityModal;
