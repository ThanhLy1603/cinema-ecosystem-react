import type { ReactElement, ReactNode } from 'react';

interface ConsoleBannerProps {
   title: string;
   description: string;
   actions?: ReactNode;
}

export function ConsoleBanner({ title, description, actions }: ConsoleBannerProps): ReactElement {
   return (
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] bg-linear-to-r from-brand-700 to-brand-900 p-6 text-white shadow-lg">
         <div className="min-w-0">
            <h1 className="text-white!">{title}</h1>
            <p className="mt-1 text-xs font-medium text-brand-100 sm:text-sm">{description}</p>
         </div>
         {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </header>
   );
}

export default ConsoleBanner;
