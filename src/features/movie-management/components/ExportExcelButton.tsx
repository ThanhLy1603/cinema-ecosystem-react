import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { todayInVietnam } from '@/lib/common/vietnamTime';
import { readBlobErrorMessage } from '../utils/blobError';
import { downloadBlob } from '../utils/downloadBlob';

interface ExportExcelButtonProps {
   filePrefix: string;
   exportFile: () => Promise<Blob>;
}

export function ExportExcelButton({ filePrefix, exportFile }: ExportExcelButtonProps): ReactElement {
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const exportMutation: UseMutationResult<Blob, unknown, void> = useMutation<Blob, unknown, void>({
      mutationFn: exportFile,
      onMutate: (): void => setErrorMessage(null),
      onSuccess: (blob) => downloadBlob(blob, `${filePrefix}-${todayInVietnam()}.xlsx`),
      onError: (error) => void readBlobErrorMessage(error).then(setErrorMessage),
   });

   return (
      <>
         <Button
            variant="secondary"
            isLoading={exportMutation.isPending}
            icon={<Download className="size-4" aria-hidden="true" />}
            onClick={() => exportMutation.mutate()}
         >
            Xuất Excel
         </Button>
         {errorMessage && (
            <div className="order-last w-full">
               <Alert variant="error">{errorMessage}</Alert>
            </div>
         )}
      </>
   );
}

export default ExportExcelButton;
