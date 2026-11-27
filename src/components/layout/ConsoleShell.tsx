import { ChevronRight, Menu, type LucideIcon } from 'lucide-react';
import { useEffect, useState, type ReactElement, type ReactNode } from 'react';

export interface ConsoleDrawerActions {
   onNavigate?: () => void;
   onClose?: () => void;
}

interface ConsoleShellProps {
   renderSidebar: (consoleDrawerActions: ConsoleDrawerActions) => ReactNode;
   headerIcon: LucideIcon;
   sectionName: string;
   pageTitle: string;
   menuLabel: string;
   headerActions: ReactNode;
   children: ReactNode;
}

export function ConsoleShell({
   renderSidebar,
   headerIcon: HeaderIcon,
   sectionName,
   pageTitle,
   menuLabel,
   headerActions,
   children,
}: ConsoleShellProps): ReactElement {
   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

   useEffect(() => {
      if (!isSidebarOpen) {
         return;
      }
      function handleKeyDown(keyboardEvent: KeyboardEvent): void {
         if (keyboardEvent.key === 'Escape') {
            setIsSidebarOpen(false);
         }
      }
      window.addEventListener('keydown', handleKeyDown);
      return (): void => {
         window.removeEventListener('keydown', handleKeyDown);
      };
   }, [isSidebarOpen]);

   function closeSidebar(): void {
      setIsSidebarOpen(false);
   }

   return (
      <div className="theme-console app-backdrop flex min-h-dvh antialiased">
         <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:shrink-0">{renderSidebar({})}</aside>

         {isSidebarOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
               <button
                  type="button"
                  aria-label="Đóng menu điều hướng"
                  onClick={closeSidebar}
                  className="fixed inset-0 bg-ink-900/60 backdrop-blur-xs"
               />
               <aside className="relative z-10 h-full shadow-soft">
                  {renderSidebar({ onNavigate: closeSidebar, onClose: closeSidebar })}
               </aside>
            </div>
         )}

         <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-ink-200 bg-white px-3 shadow-card sm:px-4">
               <div className="flex min-w-0 items-center gap-3">
                  <button
                     type="button"
                     onClick={() => setIsSidebarOpen(true)}
                     aria-label={menuLabel}
                     aria-expanded={isSidebarOpen}
                     className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-600 transition-colors hover:bg-ink-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 lg:hidden"
                  >
                     <Menu className="size-5" aria-hidden="true" />
                  </button>
                  <span className="hidden shrink-0 rounded-xl border border-brand-100 bg-brand-50 p-2 text-brand-600 sm:flex">
                     <HeaderIcon className="size-5" aria-hidden="true" />
                  </span>
                  <nav aria-label="Vị trí hiện tại" className="flex min-w-0 items-center gap-1.5 text-sm sm:text-base">
                     <span className="hidden font-semibold text-ink-500 sm:inline">{sectionName}</span>
                     <ChevronRight className="hidden size-4 shrink-0 text-ink-300 sm:block" aria-hidden="true" />
                     <span className="truncate font-bold tracking-tight text-ink-900">{pageTitle}</span>
                  </nav>
               </div>

               <div className="flex items-center gap-3">{headerActions}</div>
            </header>

            <main className="min-w-0 flex-1 p-3 sm:p-4">{children}</main>
         </div>
      </div>
   );
}

export default ConsoleShell;
