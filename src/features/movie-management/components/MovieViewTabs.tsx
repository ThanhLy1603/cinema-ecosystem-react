import type { ReactElement } from 'react';
import { cn } from '@/lib/common/utils';
import type { MovieViewTab } from '../utils/labels';

interface MovieViewTabsProps {
   movieViewTabs: MovieViewTab[];
   activeKey: string;
   onChange: (movieViewTab: MovieViewTab) => void;
}

export function MovieViewTabs({ movieViewTabs, activeKey, onChange }: MovieViewTabsProps): ReactElement {
   return (
      <div className="overflow-x-auto">
         <div role="tablist" aria-label="Trạng thái hiển thị" className="flex min-w-max gap-6 border-b border-ink-200">
            {movieViewTabs.map((movieViewTab) => (
               <button
                  key={movieViewTab.key}
                  type="button"
                  role="tab"
                  aria-selected={movieViewTab.key === activeKey}
                  onClick={() => onChange(movieViewTab)}
                  className={cn(
                     '-mb-px whitespace-nowrap border-b-2 px-0.5 pb-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-200',
                     movieViewTab.key === activeKey
                        ? 'border-brand-600 text-brand-700'
                        : 'border-transparent text-ink-500 hover:text-ink-900',
                  )}
               >
                  {movieViewTab.label}
               </button>
            ))}
         </div>
      </div>
   );
}

export default MovieViewTabs;
