import type { ReactElement, ReactNode } from 'react';

interface EmptyPanelProps {
   message: string;
   children?: ReactNode;
}

export function EmptyPanel({ message, children }: EmptyPanelProps): ReactElement {
   return (
      <div className="space-y-4 rounded-3xl bg-white px-4 py-10 text-center shadow-card ring-1 ring-ink-200/80">
         <p className="text-sm text-ink-500">{message}</p>
         {children}
      </div>
   );
}

export default EmptyPanel;
