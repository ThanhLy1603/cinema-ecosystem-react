import { cn } from '@/lib/common/utils';

export type ActionTone = 'view' | 'edit' | 'schedule' | 'remove' | 'restore';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'light' | 'destructive' | ActionTone;
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE_CLASSES: string =
   'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 in-[.theme-shinkai]:active:scale-[0.98] in-[.theme-console]:active:scale-95';

export const ACTION_TONE_CLASSES: Record<ActionTone, string> = {
   view: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200 hover:bg-sky-600 hover:text-white hover:ring-sky-600 focus-visible:ring-sky-300',
   edit: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 hover:bg-amber-500 hover:text-white hover:ring-amber-500 focus-visible:ring-amber-300',
   schedule:
      'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200 hover:bg-violet-600 hover:text-white hover:ring-violet-600 focus-visible:ring-violet-300',
   remove:
      'bg-danger-50 text-danger-700 ring-1 ring-inset ring-danger-200 hover:bg-danger-600 hover:text-white hover:ring-danger-600 focus-visible:ring-danger-300',
   restore:
      'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-600 hover:text-white hover:ring-brand-600 focus-visible:ring-brand-300',
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
   ...ACTION_TONE_CLASSES,
   destructive: 'bg-danger-600 text-white shadow-sm hover:bg-danger-700 focus-visible:ring-danger-200',
   primary:
      'text-white shadow-glow [background:var(--cta-bg)] hover:[background:var(--cta-bg-hover)] focus-visible:ring-brand-200 in-[.theme-shinkai]:hover:-translate-y-0.5',
   secondary:
      'border border-ink-200 bg-white text-ink-800 shadow-sm hover:border-ink-300 hover:bg-ink-50 focus-visible:ring-brand-100 in-[.theme-console]:hover:border-brand-300 in-[.theme-console]:hover:bg-brand-50 in-[.theme-console]:hover:text-brand-700',
   ghost: 'text-ink-700 hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-brand-100',
   light: 'bg-white text-brand-700 shadow-sm hover:bg-brand-50 focus-visible:ring-white/50',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
   sm: 'h-8 px-3 text-[13px] in-[.theme-console]:text-sm',
   md: 'h-10 px-4 text-sm',
   lg: 'h-12 px-6 text-base in-[.theme-console]:text-sm',
};

export function buttonClasses(
   variant: ButtonVariant,
   size: ButtonSize,
   fullWidth: boolean,
   className: string | undefined,
): string {
   return cn(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], fullWidth && 'w-full', className);
}
