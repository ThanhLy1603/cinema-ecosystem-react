import type { ReactElement } from 'react';

interface MovieSelectCheckboxProps {
   label: string;
   checked: boolean;
   onToggle: () => void;
}

export function MovieSelectCheckbox({ label, checked, onToggle }: MovieSelectCheckboxProps): ReactElement {
   return (
      <label className="inline-grid size-8 shrink-0 cursor-pointer place-items-center">
         <input
            type="checkbox"
            aria-label={label}
            checked={checked}
            onChange={onToggle}
            className="size-4 cursor-pointer accent-brand-600"
         />
      </label>
   );
}

export default MovieSelectCheckbox;
