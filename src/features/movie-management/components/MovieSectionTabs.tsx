import type { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/common/utils';

interface MovieSectionTabItem {
   to: string;
   label: string;
   end: boolean;
}

interface NavLinkState {
   isActive: boolean;
}

const MOVIE_SECTION_TAB_ITEMS: MovieSectionTabItem[] = [
   { to: '/admin/movies', label: 'Danh sách phim', end: true },
   { to: '/admin/movies/genres', label: 'Thể loại', end: false },
   { to: '/admin/movies/persons', label: 'Nghệ sĩ', end: false },
];

function getTabClasses({ isActive }: NavLinkState): string {
   return cn(
      'flex-1 whitespace-nowrap rounded-md px-1.5 py-1.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 sm:flex-none sm:px-4',
      isActive ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-600 hover:text-ink-900',
   );
}

export function MovieSectionTabs(): ReactElement {
   return (
      <nav aria-label="Khu vực quản lý phim" className="flex w-full gap-1 rounded-lg bg-ink-100 p-1 sm:w-fit">
         {MOVIE_SECTION_TAB_ITEMS.map((movieSectionTabItem) => (
            <NavLink
               key={movieSectionTabItem.to}
               to={movieSectionTabItem.to}
               end={movieSectionTabItem.end}
               className={getTabClasses}
            >
               {movieSectionTabItem.label}
            </NavLink>
         ))}
      </nav>
   );
}

export default MovieSectionTabs;
