import { X } from 'lucide-react';
import {
   useId,
   useLayoutEffect,
   useRef,
   type MouseEvent,
   type ReactElement,
   type ReactNode,
   type SyntheticEvent,
} from 'react';
import { cn } from '@/lib/common/utils';

interface ModalProps {
   title: string;
   onClose: () => void;
   children: ReactNode;
   isDismissDisabled?: boolean;
   closeOnBackdrop?: boolean;
   showCloseButton?: boolean;
   hideTitle?: boolean;
   size?: 'md' | 'xl' | 'wide';
   isFlush?: boolean;
}

const SIZE_CLASSES: Record<NonNullable<ModalProps['size']>, string> = {
   md: 'max-w-md',
   xl: 'max-w-xl',
   wide: 'max-w-6xl',
};

export function Modal({
   title,
   onClose,
   children,
   isDismissDisabled = false,
   closeOnBackdrop = false,
   showCloseButton = true,
   hideTitle = false,
   size = 'md',
   isFlush = false,
}: ModalProps): ReactElement {
   const dialogRef = useRef<HTMLDialogElement>(null);
   const titleId: string = useId();

   useLayoutEffect((): (() => void) => {
      const htmlDialogElement: HTMLDialogElement | null = dialogRef.current;
      htmlDialogElement?.showModal();
      return (): void => htmlDialogElement?.close();
   }, []);

   function requestClose(): void {
      if (!isDismissDisabled) {
         onClose();
      }
   }

   function handleCancel(syntheticEvent: SyntheticEvent<HTMLDialogElement>): void {
      if (syntheticEvent.target !== syntheticEvent.currentTarget) {
         return;
      }
      syntheticEvent.preventDefault();
      requestClose();
   }

   function handleNativeClose(): void {
      if (dialogRef.current && !dialogRef.current.open) {
         onClose();
      }
   }

   function handleClick(mouseEvent: MouseEvent<HTMLDialogElement>): void {
      if (closeOnBackdrop && mouseEvent.target === mouseEvent.currentTarget) {
         requestClose();
      }
   }

   return (
      <dialog
         ref={dialogRef}
         onCancel={handleCancel}
         onClose={handleNativeClose}
         onClick={handleClick}
         aria-labelledby={titleId}
         className={cn(
            'm-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] rounded-[1.5rem] bg-white p-0 shadow-soft backdrop:bg-ink-900/60 backdrop:backdrop-blur-xs',
            SIZE_CLASSES[size],
            isFlush ? 'overflow-hidden open:flex open:flex-col' : 'overflow-y-auto',
         )}
      >
         <div className={cn('relative', isFlush && 'flex min-h-0 flex-1 flex-col')}>
            <h2
               id={titleId}
               className={
                  hideTitle ? 'sr-only' : 'border-b border-ink-100 py-4 pl-5 pr-14 text-base font-bold text-ink-900'
               }
            >
               {title}
            </h2>
            <div className={isFlush ? 'flex min-h-[min(28rem,calc(100dvh-8rem))] flex-1 flex-col' : 'p-5'}>
               {children}
            </div>
            {showCloseButton && (
               <button
                  type="button"
                  onClick={requestClose}
                  aria-label="Đóng"
                  className="absolute right-3 top-3 grid size-8 place-items-center rounded-lg bg-ink-100 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
               >
                  <X className="size-5" aria-hidden="true" />
               </button>
            )}
         </div>
      </dialog>
   );
}

export default Modal;
