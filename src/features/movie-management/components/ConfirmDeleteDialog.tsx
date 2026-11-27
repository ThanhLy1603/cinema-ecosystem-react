import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import Modal from '@/components/common/Modal';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/common/apiError';

interface ConfirmDeleteDialogProps {
   title: string;
   confirmLabel: string;
   deleteEntity: () => Promise<void>;
   onClose: () => void;
   onDeleted: () => void;
   children: ReactNode;
}

export function ConfirmDeleteDialog({
   title,
   confirmLabel,
   deleteEntity,
   onClose,
   onDeleted,
   children,
}: ConfirmDeleteDialogProps): ReactElement {
   const deleteMutation: UseMutationResult<void, unknown, void> = useMutation<void, unknown, void>({
      mutationFn: deleteEntity,
      onSuccess: onDeleted,
   });

   return (
      <Modal
         title={title}
         onClose={onClose}
         isDismissDisabled={deleteMutation.isPending}
         closeOnBackdrop
         showCloseButton={false}
         hideTitle
      >
         <div className="space-y-3 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-danger-100 text-danger-600">
               <Trash2 className="size-6" aria-hidden="true" />
            </span>
            <h3 aria-hidden="true" className="text-sm font-bold text-ink-900">
               {title}
            </h3>
            <p className="text-sm leading-relaxed text-ink-500">{children}</p>
            {deleteMutation.isError && <Alert variant="error">{getErrorMessage(deleteMutation.error)}</Alert>}
            <div className="flex justify-center gap-2 pt-2">
               <Button variant="secondary" className="flex-1" disabled={deleteMutation.isPending} onClick={onClose}>
                  Hủy
               </Button>
               <Button
                  isLoading={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate()}
                  variant="destructive"
                  className="flex-1"
               >
                  {confirmLabel}
               </Button>
            </div>
         </div>
      </Modal>
   );
}

export default ConfirmDeleteDialog;
