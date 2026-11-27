import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { ArrowLeft, ChevronRight, LogOut, X, type LucideIcon } from 'lucide-react';
import type { ReactElement } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { logout } from '@/api/auth/authApi';
import Logo from '@/components/brand/Logo';
import { getErrorMessage } from '@/lib/common/apiError';
import { useFinishSignOut } from '@/lib/auth/useFinishSignOut';
import { cn } from '@/lib/common/utils';

export interface ConsoleNavItem {
   label: string;
   to: string;
   icon: LucideIcon;
   end?: boolean;
   badge?: string;
}

interface ConsoleSidebarProps {
   homePath: string;
   sectionLabel: string;
   navigationLabel: string;
   consoleNavItems: ConsoleNavItem[];
   roleLabel: string;
   scopeLabel: string;
   onNavigate?: () => void;
   onClose?: () => void;
}

function getNavLinkClassName(isActive: boolean): string {
   return cn(
      'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all',
      isActive
         ? 'translate-x-1 bg-brand-600 text-white shadow-glow'
         : 'text-ink-600 hover:bg-ink-100 hover:text-brand-600',
   );
}

export function ConsoleSidebar({
   homePath,
   sectionLabel,
   navigationLabel,
   consoleNavItems,
   roleLabel,
   scopeLabel,
   onNavigate,
   onClose,
}: ConsoleSidebarProps): ReactElement {
   const finishSignOut: () => void = useFinishSignOut();
   const logoutMutation: UseMutationResult<void, unknown, void> = useMutation<void, unknown, void>({
      mutationFn: logout,
      onSuccess: finishSignOut,
   });

   return (
      <div className="flex h-full w-72 flex-col border-r border-ink-200 bg-white text-ink-900">
         <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink-100 px-5">
            <Logo to={homePath} />
            {onClose && (
               <button
                  type="button"
                  onClick={onClose}
                  aria-label="Đóng thanh điều hướng"
                  className="grid size-8 place-items-center rounded-lg bg-ink-100 text-ink-500 transition-colors hover:text-ink-900 lg:hidden"
               >
                  <X className="size-5" aria-hidden="true" />
               </button>
            )}
         </div>

         <div className="flex-1 overflow-y-auto p-4">
            <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-ink-400">{sectionLabel}</p>
            <nav className="space-y-1.5" aria-label={navigationLabel}>
               {consoleNavItems.map((consoleNavItem) => (
                  <NavLink
                     key={consoleNavItem.to}
                     to={consoleNavItem.to}
                     end={consoleNavItem.end}
                     onClick={onNavigate}
                     className={({ isActive }) => getNavLinkClassName(isActive)}
                  >
                     {({ isActive }) => (
                        <>
                           <consoleNavItem.icon
                              className={cn('size-5 shrink-0', isActive ? 'text-white' : 'text-ink-500')}
                              aria-hidden="true"
                           />
                           <span className="truncate">{consoleNavItem.label}</span>
                           {consoleNavItem.badge && (
                              <span
                                 className={cn(
                                    'ml-auto shrink-0 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-semibold',
                                    isActive ? 'bg-white text-brand-700' : 'bg-ink-100 text-ink-500',
                                 )}
                              >
                                 {consoleNavItem.badge}
                              </span>
                           )}
                           {isActive && !consoleNavItem.badge && (
                              <ChevronRight className="ml-auto size-4 shrink-0 text-white/80" aria-hidden="true" />
                           )}
                        </>
                     )}
                  </NavLink>
               ))}
            </nav>
         </div>

         <div className="space-y-1.5 border-t border-ink-100 bg-ink-50 p-4">
            <div className="px-4 pb-1">
               <p className="text-sm font-bold text-ink-900">{roleLabel}</p>
               <p className="text-xs text-ink-500">{scopeLabel}</p>
            </div>
            <Link
               to="/"
               onClick={onNavigate}
               className="flex items-center gap-3 rounded-xl border border-transparent px-4 py-2.5 text-sm font-semibold text-ink-600 transition-all hover:border-ink-200 hover:bg-white hover:text-brand-600"
            >
               <ArrowLeft className="size-5 text-ink-500" aria-hidden="true" />
               Về trang khách hàng
            </Link>
            <button
               type="button"
               disabled={logoutMutation.isPending}
               onClick={() => logoutMutation.mutate()}
               className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-danger-600 transition-colors hover:bg-danger-50 disabled:opacity-60"
            >
               <LogOut className="size-5" aria-hidden="true" />
               {logoutMutation.isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}
            </button>
            {logoutMutation.isError && (
               <p role="alert" className="px-4 text-xs font-medium text-danger-700">
                  {getErrorMessage(logoutMutation.error)}
               </p>
            )}
         </div>
      </div>
   );
}

export default ConsoleSidebar;
