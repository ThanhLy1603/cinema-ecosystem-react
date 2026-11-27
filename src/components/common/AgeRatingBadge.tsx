import type { ReactElement } from 'react';
import { AGE_RATING_BADGE_CLASSES, AGE_RATING_DESCRIPTIONS } from '@/lib/movie/movieLabels';
import { cn } from '@/lib/common/utils';
import type { AgeRating } from '@/types/movie/movie';

interface AgeRatingBadgeProps {
   ageRating: AgeRating;
   className?: string;
}

export function AgeRatingBadge({ ageRating, className }: AgeRatingBadgeProps): ReactElement {
   return (
      <span
         className={cn(
            'inline-block w-fit rounded-md px-2 py-0.5 text-center text-xs font-semibold leading-snug',
            AGE_RATING_BADGE_CLASSES[ageRating],
            className,
         )}
      >
         {AGE_RATING_DESCRIPTIONS[ageRating]}
      </span>
   );
}

export default AgeRatingBadge;
