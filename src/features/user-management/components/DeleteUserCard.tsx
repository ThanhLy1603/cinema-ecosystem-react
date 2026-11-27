import { useMutation, useQueryClient, type QueryClient, type UseMutationResult } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import { deleteUser } from '@/api/auth/adminUserApi';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/common/apiError';
import type { AdminUser } from '@/types/auth/admin';
import { ADMIN_USER_LIST_KEY } from '../utils/queryKeys';

interface DeleteUserCardProps {
   adminUser: AdminUser;
   isSelf: boolean;
   onDeleted: () => void;
}

export function DeleteUserCard({ adminUser, isSelf, onDeleted }: DeleteUserCardProps): ReactElement {
   const [isConfirming, setIsConfirming] = useState<boolean>(false);
   const queryClient: QueryClient = useQueryClient();

   function handleDeleted(): void {
      void queryClient.invalidateQueries({ queryKey: ADMIN_USER_LIST_KEY });
      onDeleted();
   }

   const deleteMutation: UseMutationResult<void, unknown, void> = useMutation<void, unknown, void>({
      mutationFn: () => deleteUser(adminUser.id),
      onSuccess: handleDeleted,
   });

   const isDisabled: boolean = isSelf || adminUser.status === 'DELETED';

   return (
      <div className="space-y-5">
         {deleteMutation.isError && <Alert variant="error">{getErrorMessage(deleteMutation.error)}</Alert>}
         {isSelf && <Alert variant="info">Bạn không thể tự xóa tài khoản của chính mình.</Alert>}
         <p className="text-sm text-ink-600">
            Tài khoản bị xóa mềm: không thể đăng nhập và bị ẩn khỏi danh sách, nhưng dữ liệu vẫn được giữ lại.
         </p>
         {!isConfirming ? (
            <Button
               variant="remove"
               disabled={isDisabled}
               icon={<Trash2 className="size-4" aria-hidden="true" />}
               onClick={() => setIsConfirming(true)}
            >
               Xóa tài khoản
            </Button>
         ) : (
            <div className="flex flex-wrap gap-3">
               <Button
                  variant="destructive"
                  isLoading={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate()}
               >
                  Xác nhận xóa
               </Button>
               <Button variant="ghost" onClick={() => setIsConfirming(false)}>
                  Hủy
               </Button>
            </div>
         )}
      </div>
   );
}

export default DeleteUserCard;
