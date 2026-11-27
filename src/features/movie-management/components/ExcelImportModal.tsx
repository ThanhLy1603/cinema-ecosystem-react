import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useState, type ReactElement, type ReactNode } from 'react';
import Modal from '@/components/common/Modal';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/common/apiError';
import type { ImportActions, ImportReport, ImportRow } from '@/types/movie/movieImport';
import { downloadBlob } from '../utils/downloadBlob';
import FileDropZone from './FileDropZone';

interface ExcelImportModalProps<TImportReport extends ImportReport> {
   title: string;
   description: string;
   itemName: string;
   maxRows: number;
   templateFilename: string;
   importActions: ImportActions<TImportReport>;
   renderRows: (importReport: TImportReport) => ReactNode;
   importedAction?: ReactNode;
   onImported: () => void;
   onClose: () => void;
}

function isRejectedRow(importRow: ImportRow): boolean {
   return importRow.rowStatus === 'DUPLICATE' || importRow.rowStatus === 'ERROR';
}

export function ExcelImportModal<TImportReport extends ImportReport>({
   title,
   description,
   itemName,
   maxRows,
   templateFilename,
   importActions,
   renderRows,
   importedAction,
   onImported,
   onClose,
}: ExcelImportModalProps<TImportReport>): ReactElement {
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const templateMutation: UseMutationResult<Blob, unknown, void> = useMutation<Blob, unknown, void>({
      mutationFn: () => importActions.downloadTemplate(),
      onSuccess: (blob) => downloadBlob(blob, templateFilename),
   });
   const previewMutation: UseMutationResult<TImportReport, unknown, File> = useMutation<TImportReport, unknown, File>({
      mutationFn: (file) => importActions.previewImport(file),
   });
   const importMutation: UseMutationResult<TImportReport, unknown, File> = useMutation<TImportReport, unknown, File>({
      mutationFn: (file) => importActions.importRows(file),
      onSuccess: onImported,
   });
   const exportMutation: UseMutationResult<Blob, unknown, number[]> = useMutation<Blob, unknown, number[]>({
      mutationFn: (rowNumbers) => importActions.exportRows(selectedFile as File, rowNumbers),
      onSuccess: (blob) => downloadBlob(blob, 'dong-can-sua.xlsx'),
   });
   const importReport: TImportReport | undefined = importMutation.data ?? previewMutation.data;
   const isImported: boolean = importMutation.data !== undefined;
   const rejectedRowNumbers: number[] = (importReport?.rows ?? [])
      .filter(isRejectedRow)
      .map((importRow) => importRow.rowNumber);
   const failedMutationError: unknown =
      templateMutation.error ?? previewMutation.error ?? importMutation.error ?? exportMutation.error;
   const isBusy: boolean = previewMutation.isPending || importMutation.isPending;

   function handleFilesSelected(files: File[]): void {
      const file: File = files[0];
      setSelectedFile(file);
      importMutation.reset();
      exportMutation.reset();
      previewMutation.reset();
      previewMutation.mutate(file);
   }

   return (
      <Modal title={title} size="wide" isFlush isDismissDisabled={isBusy} onClose={onClose}>
         <div className="relative min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
               <p className="text-sm text-ink-500">{description}</p>
               <Button
                  variant="secondary"
                  isLoading={templateMutation.isPending}
                  icon={<Download className="size-4" aria-hidden="true" />}
                  onClick={() => templateMutation.mutate()}
               >
                  Tải tệp mẫu
               </Button>
            </div>

            <FileDropZone
               title={selectedFile?.name ?? 'Kéo thả tệp Excel vào đây'}
               hint={`Định dạng .xlsx, tối đa 2 MB và ${maxRows} ${itemName}. Chưa có gì được tạo cho tới khi bạn xác nhận.`}
               accept=".xlsx"
               buttonLabel={selectedFile === null ? 'Chọn tệp từ máy' : 'Chọn tệp khác'}
               disabled={isBusy}
               onFilesSelected={handleFilesSelected}
            />

            {failedMutationError !== null && <Alert variant="error">{getErrorMessage(failedMutationError)}</Alert>}
            {previewMutation.isPending && <p className="text-sm text-ink-500">Đang kiểm tra tệp...</p>}
            {importMutation.data && (
               <Alert variant={importMutation.data.createdRows > 0 ? 'success' : 'error'}>
                  Đã tạo {importMutation.data.createdRows} trên {importMutation.data.totalRows} {itemName}.
               </Alert>
            )}

            {importReport && (
               <section className="space-y-3">
                  <div>
                     <h3 className="text-base font-bold text-ink-900">{isImported ? 'Kết quả nhập' : 'Xem trước'}</h3>
                     <p className="text-sm text-ink-500">
                        {isImported
                           ? `Đã tạo ${importReport.createdRows}, trùng ${importReport.duplicateRows}, lỗi ${importReport.errorRows}.`
                           : `Hợp lệ ${importReport.validRows}, trùng ${importReport.duplicateRows}, lỗi ${importReport.errorRows}.`}
                     </p>
                  </div>
                  {renderRows(importReport)}
               </section>
            )}
         </div>

         {importReport && (
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-ink-100 px-5 py-3">
               {rejectedRowNumbers.length > 0 && (
                  <Button
                     variant="secondary"
                     isLoading={exportMutation.isPending}
                     icon={<Download className="size-4" aria-hidden="true" />}
                     onClick={() => exportMutation.mutate(rejectedRowNumbers)}
                  >
                     Tải các dòng cần sửa
                  </Button>
               )}
               {isImported ? (
                  (importedAction ?? <Button onClick={onClose}>Xong</Button>)
               ) : (
                  <Button
                     disabled={importReport.validRows === 0}
                     isLoading={importMutation.isPending}
                     icon={<FileSpreadsheet className="size-4" aria-hidden="true" />}
                     onClick={() => importMutation.mutate(selectedFile as File)}
                  >
                     Tạo {importReport.validRows} {itemName} hợp lệ
                  </Button>
               )}
            </div>
         )}
      </Modal>
   );
}

export default ExcelImportModal;
