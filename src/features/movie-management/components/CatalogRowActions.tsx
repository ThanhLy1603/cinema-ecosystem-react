import { Clapperboard, Pencil, Trash2 } from 'lucide-react';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ACTION_TONE_CLASSES } from '@/lib/common/buttonStyles';
import { cn } from '@/lib/common/utils';
import { ROW_ACTION_CLASSES } from '../utils/actionClasses';

interface CatalogRowActionsProps {
   entityName: string;
   moviesPath: string;
   canDelete: boolean;
   onEdit: () => void;
   onDelete: () => void;
}

export function CatalogRowActions({
   entityName,
   moviesPath,
   canDelete,
   onEdit,
   onDelete,
}: CatalogRowActionsProps): ReactElement {
   return (
      <div className="flex items-center justify-center gap-1.5">
         <button
            type="button"
            onClick={onEdit}
            aria-label={`Sửa ${entityName}`}
            title="Sửa"
            className={cn(ROW_ACTION_CLASSES, ACTION_TONE_CLASSES.edit)}
         >
            <Pencil className="size-4" aria-hidden="true" />
         </button>
         <Link
            to={moviesPath}
            aria-label={`Xem phim của ${entityName}`}
            title="Xem phim"
            className={cn(ROW_ACTION_CLASSES, ACTION_TONE_CLASSES.view)}
         >
            <Clapperboard className="size-4" aria-hidden="true" />
         </Link>
         {canDelete && (
            <button
               type="button"
               onClick={onDelete}
               aria-label={`Xóa ${entityName}`}
               title="Xóa"
               className={cn(ROW_ACTION_CLASSES, ACTION_TONE_CLASSES.remove)}
            >
               <Trash2 className="size-4" aria-hidden="true" />
            </button>
         )}
      </div>
   );
}

export default CatalogRowActions;
