import type { ReactElement, ReactNode } from 'react';

interface SectionCardProps {
   title: string;
   description?: string;
   children: ReactNode;
}

export function SectionCard({ title, description, children }: SectionCardProps): ReactElement {
   return (
      <section className="rounded-lg bg-white shadow-card ring-1 ring-ink-200/80">
         <div className="border-b border-ink-100 px-5 py-3.5">
            <h2 className="text-base font-bold text-ink-900">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-ink-500">{description}</p>}
         </div>
         <div className="p-5">{children}</div>
      </section>
   );
}

export default SectionCard;
