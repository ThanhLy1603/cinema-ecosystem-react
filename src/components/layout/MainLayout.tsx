import type { ReactElement } from 'react';
import { useLocation, type Location } from 'react-router-dom';
import PageOutlet from '@/components/common/PageOutlet';
import Footer from './Footer';
import Navbar from './Navbar';
import PendingBookingBanner from './PendingBookingBanner';
import ScrollToTopButton from './ScrollToTopButton';

export function MainLayout(): ReactElement {
   const location: Location = useLocation();

   return (
      <div className="theme-shinkai app-backdrop flex min-h-dvh flex-col">
         <Navbar />
         <PendingBookingBanner />
         <main key={location.pathname} className="flex-1 animate-fade-in">
            <PageOutlet />
         </main>
         <Footer />
         <ScrollToTopButton />
      </div>
   );
}

export default MainLayout;
