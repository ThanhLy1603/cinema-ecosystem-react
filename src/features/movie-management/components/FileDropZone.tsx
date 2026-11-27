import { Upload } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type DragEvent, type ReactElement } from 'react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/common/utils';

interface FileDropZoneProps {
   title: string;
   hint: string;
   accept: string;
   buttonLabel: string;
   multiple?: boolean;
   disabled?: boolean;
   onFilesSelected: (files: File[]) => void;
}

export function FileDropZone({
   title,
   hint,
   accept,
   buttonLabel,
   multiple = false,
   disabled = false,
   onFilesSelected,
}: FileDropZoneProps): ReactElement {
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [isDragging, setIsDragging] = useState<boolean>(false);

   function selectFiles(fileList: FileList | null): void {
      const files: File[] = Array.from(fileList ?? []);
      if (!disabled && files.length > 0) {
         onFilesSelected(multiple ? files : files.slice(0, 1));
      }
   }

   function handleDragOver(dragEvent: DragEvent<HTMLDivElement>): void {
      dragEvent.preventDefault();
      setIsDragging(!disabled);
   }

   function handleDrop(dragEvent: DragEvent<HTMLDivElement>): void {
      dragEvent.preventDefault();
      setIsDragging(false);
      selectFiles(dragEvent.dataTransfer.files);
   }

   function handleFileChange(changeEvent: ChangeEvent<HTMLInputElement>): void {
      selectFiles(changeEvent.target.files);
      changeEvent.target.value = '';
   }

   return (
      <div
         onDragOver={handleDragOver}
         onDragLeave={() => setIsDragging(false)}
         onDrop={handleDrop}
         className={cn(
            'flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors',
            isDragging ? 'border-brand-500 bg-brand-50' : 'border-ink-300 bg-ink-50/60',
         )}
      >
         <Upload className="size-8 text-ink-400" aria-hidden="true" />
         <div>
            <p className="text-sm font-bold text-ink-900">{title}</p>
            <p className="mt-0.5 text-sm text-ink-500">{hint}</p>
         </div>
         <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
            aria-label={title}
         />
         <Button variant="secondary" disabled={disabled} onClick={() => fileInputRef.current?.click()}>
            {buttonLabel}
         </Button>
      </div>
   );
}

export default FileDropZone;
