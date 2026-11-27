import { CircleAlert, Eye, EyeOff, X, type LucideIcon } from 'lucide-react';
import { useRef, useState, type KeyboardEvent, type ReactElement } from 'react';
import { cn } from '@/lib/common/utils';

interface TextFieldProps {
   id: string;
   label: string;
   value: string;
   onChange: (value: string) => void;
   type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'time';
   icon?: LucideIcon;
   error?: string;
   hint?: string;
   placeholder?: string;
   autoComplete?: string;
   disabled?: boolean;
   optional?: boolean;
   maxLength?: number;
   max?: string;
   autoFocus?: boolean;
   hideLabel?: boolean;
   clearable?: boolean;
   expandable?: boolean;
}

export function TextField({
   id,
   label,
   value,
   onChange,
   type = 'text',
   icon: Icon,
   error,
   hint,
   placeholder,
   autoComplete,
   disabled = false,
   optional = false,
   maxLength,
   max,
   autoFocus = false,
   hideLabel = false,
   clearable = false,
   expandable = false,
}: TextFieldProps): ReactElement {
   const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
   const isPasswordField: boolean = type === 'password';
   const inputType: string = isPasswordField && isPasswordVisible ? 'text' : type;
   const messageId: string = `${id}-message`;
   const hasError: boolean = Boolean(error);
   const inputRef = useRef<HTMLInputElement>(null);
   const canClear: boolean = clearable && !disabled && !isPasswordField && value.length > 0;

   const stateClassName: string = cn(
      'w-full rounded-lg border bg-white text-sm text-ink-900 shadow-sm outline-none transition-colors placeholder:text-ink-300 disabled:bg-ink-50 disabled:text-ink-400',
      hasError
         ? 'border-danger-400 focus:border-danger-500 focus:ring-2 focus:ring-danger-100'
         : 'border-ink-200 hover:border-ink-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
   );

   function submitOnEnter(keyboardEvent: KeyboardEvent<HTMLTextAreaElement>): void {
      if (keyboardEvent.key !== 'Enter' || keyboardEvent.nativeEvent.isComposing) {
         return;
      }
      keyboardEvent.preventDefault();
      keyboardEvent.currentTarget.form?.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
   }

   function clearValue(): void {
      onChange('');
      inputRef.current?.focus();
   }

   return (
      <div className="space-y-1">
         <label
            htmlFor={id}
            className={cn(
               'flex items-baseline justify-between text-[13px] font-semibold text-ink-700 in-[.theme-console]:text-sm',
               hideLabel && 'sr-only',
            )}
         >
            <span>{label}</span>
            {optional && <span className="text-xs font-normal text-ink-400">Không bắt buộc</span>}
         </label>

         <div className="relative">
            {Icon && (
               <Icon
                  className={cn(
                     'pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 transition-colors',
                     hasError ? 'text-danger-500' : 'text-ink-400',
                  )}
                  aria-hidden="true"
               />
            )}
            {expandable ? (
               <textarea
                  id={id}
                  name={id}
                  rows={1}
                  value={value}
                  onChange={(changeEvent) => onChange(changeEvent.target.value.replace(/[\r\n]+/g, ' '))}
                  onKeyDown={submitOnEnter}
                  placeholder={placeholder}
                  autoComplete="off"
                  disabled={disabled}
                  maxLength={maxLength}
                  autoFocus={autoFocus}
                  aria-invalid={hasError}
                  aria-describedby={error || hint ? messageId : undefined}
                  className={cn(
                     stateClassName,
                     'block field-sizing-content max-h-[min(20rem,50dvh)] min-h-10 resize-y break-words px-3 py-[9px] leading-5',
                  )}
               />
            ) : (
               <input
                  ref={inputRef}
                  id={id}
                  name={id}
                  type={inputType}
                  value={value}
                  onChange={(changeEvent) => onChange(changeEvent.target.value)}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  disabled={disabled}
                  maxLength={maxLength}
                  max={max}
                  autoFocus={autoFocus}
                  aria-invalid={hasError}
                  aria-describedby={error || hint ? messageId : undefined}
                  className={cn(
                     stateClassName,
                     'h-10',
                     Icon ? 'pl-10' : 'pl-3',
                     isPasswordField ? 'pr-11' : canClear ? 'pr-9' : 'pr-3',
                  )}
               />
            )}
            {canClear && (
               <button
                  type="button"
                  aria-label="Xóa nội dung"
                  onClick={clearValue}
                  className="absolute right-1.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
               >
                  <X className="size-4" aria-hidden="true" />
               </button>
            )}
            {isPasswordField && (
               <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  aria-label={isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
               >
                  {isPasswordVisible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
               </button>
            )}
         </div>

         {error ? (
            <p
               id={messageId}
               role="alert"
               className="flex items-center gap-1.5 text-[13px] font-medium text-danger-700 in-[.theme-console]:text-xs"
            >
               <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
               {error}
            </p>
         ) : (
            hint && (
               <p id={messageId} className="text-[13px] text-ink-500 in-[.theme-console]:text-xs">
                  {hint}
               </p>
            )
         )}
      </div>
   );
}

export default TextField;
