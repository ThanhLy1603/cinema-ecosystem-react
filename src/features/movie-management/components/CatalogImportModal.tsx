import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { catalogImportActions } from '@/api/movie/movieImportApi';
import { PUBLIC_MOVIES_KEY } from '@/lib/movie/movieQueryKeys';
import { cn } from '@/lib/common/utils';
import type { CatalogImportReport, CatalogImportType } from '@/types/movie/movieImport';
import { ADMIN_GENRES_KEY, ADMIN_PERSONS_KEY, PERSON_OPTIONS_KEY } from '../utils/queryKeys';
import ExcelImportModal from './ExcelImportModal';
import ImportStatusBadge from './ImportStatusBadge';

interface CatalogImportModalProps {
   catalogImportType: CatalogImportType;
   onClose: () => void;
}

interface CatalogImportConfig {
   title: string;
   description: string;
   itemName: string;
   nameHeader: string;
   templateFilename: string;
   queryKeys: readonly (readonly string[])[];
}

const CATALOG_IMPORT_CONFIGS: Record<CatalogImportType, CatalogImportConfig> = {
   genres: {
      title: 'Nhập thể loại từ Excel',
      description: 'Mỗi dòng một thể loại. Tên đã có sẽ được bỏ qua.',
      itemName: 'thể loại',
      nameHeader: 'Thể loại',
      templateFilename: 'mau-nhap-the-loai.xlsx',
      queryKeys: [ADMIN_GENRES_KEY, PUBLIC_MOVIES_KEY],
   },
   persons: {
      title: 'Nhập nghệ sĩ từ Excel',
      description: 'Mỗi dòng một người, kèm ảnh đại diện và tiểu sử nếu có. Tên đã có sẽ được bỏ qua.',
      itemName: 'nghệ sĩ',
      nameHeader: 'Nghệ sĩ',
      templateFilename: 'mau-nhap-nghe-si.xlsx',
      queryKeys: [ADMIN_PERSONS_KEY, PERSON_OPTIONS_KEY],
   },
};

const CELL_CLASSES: string = 'px-4 py-3 align-top';

export function CatalogImportModal({ catalogImportType, onClose }: CatalogImportModalProps): ReactElement {
   const queryClient: QueryClient = useQueryClient();
   const catalogImportConfig: CatalogImportConfig = CATALOG_IMPORT_CONFIGS[catalogImportType];

   function refreshCatalog(): void {
      for (const queryKey of catalogImportConfig.queryKeys) {
         void queryClient.invalidateQueries({ queryKey });
      }
   }

   function renderRows(catalogImportReport: CatalogImportReport): ReactElement {
      return (
         <div className="overflow-x-auto rounded-xl ring-1 ring-ink-200">
            <table className="w-full min-w-[560px] text-left text-sm">
               <thead className="bg-ink-50 text-xs text-ink-500">
                  <tr>
                     <th className={CELL_CLASSES}>Dòng</th>
                     <th className={CELL_CLASSES}>{catalogImportConfig.nameHeader}</th>
                     <th className={CELL_CLASSES}>Kết quả</th>
                     <th className={CELL_CLASSES}>Ghi chú</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-ink-100">
                  {catalogImportReport.rows.map((catalogImportRow) => (
                     <tr key={catalogImportRow.rowNumber}>
                        <td className={cn(CELL_CLASSES, 'text-ink-500')}>{catalogImportRow.rowNumber}</td>
                        <td className={cn(CELL_CLASSES, 'max-w-sm')}>
                           <p className="break-words font-semibold text-ink-900">
                              {catalogImportRow.name || 'Chưa có tên'}
                           </p>
                           {catalogImportRow.detail && (
                              <p className="line-clamp-2 text-xs text-ink-500">{catalogImportRow.detail}</p>
                           )}
                        </td>
                        <td className={CELL_CLASSES}>
                           <ImportStatusBadge importRowStatus={catalogImportRow.rowStatus} />
                        </td>
                        <td className={cn(CELL_CLASSES, 'text-ink-700')}>
                           {catalogImportRow.errors.map((errorMessage) => (
                              <p key={errorMessage}>{errorMessage}</p>
                           ))}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      );
   }

   return (
      <ExcelImportModal<CatalogImportReport>
         title={catalogImportConfig.title}
         description={catalogImportConfig.description}
         itemName={catalogImportConfig.itemName}
         maxRows={500}
         templateFilename={catalogImportConfig.templateFilename}
         importActions={catalogImportActions[catalogImportType]}
         renderRows={renderRows}
         onImported={refreshCatalog}
         onClose={onClose}
      />
   );
}

export default CatalogImportModal;
