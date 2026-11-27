import { RotateCcw, Search } from 'lucide-react';
import type { FormEvent, ReactElement } from 'react';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { useDebouncedKeyword } from '../hooks/useDebouncedKeyword';

interface KeywordFilterBarProps {
   id: string;
   placeholder: string;
   appliedKeyword: string;
   onApply: (keyword: string) => void;
}

export function KeywordFilterBar({ id, placeholder, appliedKeyword, onApply }: KeywordFilterBarProps): ReactElement {
   const { typedKeyword, setTypedKeyword, applyKeyword } = useDebouncedKeyword(appliedKeyword, onApply);

   function handleSubmit(formEvent: FormEvent<HTMLFormElement>): void {
      formEvent.preventDefault();
      applyKeyword();
   }

   function handleReset(): void {
      setTypedKeyword('');
      onApply('');
   }

   return (
      <form
         onSubmit={handleSubmit}
         className="flex flex-col gap-3 rounded-lg bg-white px-2 py-4 shadow-card ring-1 ring-ink-200/80 sm:flex-row sm:items-end sm:px-4"
      >
         <div className="min-w-0 sm:flex-1">
            <TextField
               id={id}
               label="Tìm kiếm"
               value={typedKeyword}
               onChange={setTypedKeyword}
               icon={Search}
               placeholder={placeholder}
               clearable
            />
         </div>
         {appliedKeyword && (
            <Button
               variant="secondary"
               icon={<RotateCcw className="size-4" aria-hidden="true" />}
               onClick={handleReset}
               className="shrink-0 self-end"
            >
               Đặt lại
            </Button>
         )}
      </form>
   );
}

export default KeywordFilterBar;
